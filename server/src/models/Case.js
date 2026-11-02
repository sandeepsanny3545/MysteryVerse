import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  alibi: { type: String, required: true },
  statement: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  initialStress: { type: Number, default: 20 },
  behavioralTell: { type: String, default: 'Avoids direct eye contact when questioned.' },
  isGuilty: { type: Boolean, default: false }
}, { _id: false });

const clueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Physical Evidence' },
  description: { type: String, required: true },
  location: { type: String, default: 'Crime Scene' },
  forensicReport: { type: String, required: true },
  isSmokingGun: { type: Boolean, default: false }
}, { _id: false });

const hintSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { _id: false });

const accusationSchema = new mongoose.Schema({
  accusedId: { type: String },
  motive: { type: String },
  reasoning: { type: String },
  isCorrect: { type: Boolean },
  submittedAt: { type: Date }
}, { _id: false });

export const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  premise: { type: String, required: true },
  story: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  suspects: [suspectSchema],
  clues: [clueSchema],
  hints: [hintSchema],
  culpritId: { type: String, required: true }, // Private - never sent to frontend before accusation
  solutionExplanation: { type: String, required: true }, // Private - never sent to frontend before accusation
  discoveredClues: { type: [String], default: [] },
  hintsUsed: { type: [Number], default: [] },
  accusation: { type: accusationSchema, default: null },
  score: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'solved', 'failed'], 
    default: 'active' 
  }
}, { timestamps: true });

function formatPublicJSON(caseObj) {
  const result = { ...caseObj };

  // If case is still active, strictly protect solution details
  if (result.status === 'active') {
    delete result.culpritId;
    delete result.solutionExplanation;

    if (result.suspects && Array.isArray(result.suspects)) {
      result.suspects = result.suspects.map(s => {
        const { isGuilty, ...publicSuspect } = s;
        return publicSuspect;
      });
    }

    if (result.hints && Array.isArray(result.hints)) {
      result.hints = result.hints.map(h => {
        const isUnlocked = (result.hintsUsed || []).includes(h.id);
        return {
          id: h.id,
          title: h.title,
          content: isUnlocked ? h.content : 'Sealed Chief Inspector Hint. Request to decrypt.',
          isUnlocked
        };
      });
    }
  }

  return result;
}

caseSchema.methods.toPublicJSON = function () {
  return formatPublicJSON(this.toObject());
};

const MongooseCase = mongoose.model('Case', caseSchema);

// In-Memory store for instant, zero-dependency offline resilience
const inMemoryStore = new Map();

class InMemoryCase {
  constructor(data) {
    this._id = data._id || new mongoose.Types.ObjectId().toString();
    this.title = data.title;
    this.premise = data.premise;
    this.story = data.story;
    this.difficulty = data.difficulty || 'Medium';
    this.suspects = data.suspects || [];
    this.clues = data.clues || [];
    this.hints = data.hints || [];
    this.culpritId = data.culpritId;
    this.solutionExplanation = data.solutionExplanation;
    this.discoveredClues = data.discoveredClues || [];
    this.hintsUsed = data.hintsUsed || [];
    this.accusation = data.accusation || null;
    this.score = data.score || 0;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
  }

  async save() {
    this.updatedAt = new Date();
    inMemoryStore.set(this._id.toString(), this);
    return this;
  }

  toObject() {
    return {
      _id: this._id,
      title: this.title,
      premise: this.premise,
      story: this.story,
      difficulty: this.difficulty,
      suspects: this.suspects,
      clues: this.clues,
      hints: this.hints,
      culpritId: this.culpritId,
      solutionExplanation: this.solutionExplanation,
      discoveredClues: this.discoveredClues,
      hintsUsed: this.hintsUsed,
      accusation: this.accusation,
      score: this.score,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toPublicJSON() {
    return formatPublicJSON(this.toObject());
  }
}

export const Case = new Proxy(MongooseCase, {
  construct(target, args) {
    if (mongoose.connection.readyState === 1) {
      return new target(...args);
    }
    return new InMemoryCase(args[0] || {});
  },
  get(target, prop) {
    if (prop === 'findById') {
      return async (id) => {
        if (mongoose.connection.readyState === 1) {
          return target.findById(id);
        }
        return inMemoryStore.get(String(id)) || null;
      };
    }
    if (prop === 'find') {
      return async (query = {}) => {
        if (mongoose.connection.readyState === 1) {
          return target.find(query);
        }
        return Array.from(inMemoryStore.values());
      };
    }
    return target[prop];
  }
});

export default Case;

