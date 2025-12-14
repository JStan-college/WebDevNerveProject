import Challenge from '../models/Challenge.js';

export async function getAllChallenges(_, res) {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.status(200).json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createChallenge(req, res) {
  try {
    const { title, genre } = req.body;
    const newChallenge = new Challenge({ title, genre });
    const saved = await newChallenge.save();
    res.status(201).json({ message: 'Challenge created', challenge: saved });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
}

export async function updateChallenge(req, res) {
  try {
    const { title, genre } = req.body;
    const updated = await Challenge.findByIdAndUpdate(req.params.id, { title, genre }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Challenge not found' });
    res.status(200).json({ message: 'Challenge updated', challenge: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
}

export async function deleteChallenge(req, res) {
  try {
    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Challenge not found' });
    res.status(200).json({ message: 'Challenge deleted', challenge: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export async function getChallengeById(req, res) {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.status(200).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
