import Score from "../models/Score.js";

// Récupérer les notes de toutes les recettes
export const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find();
    res.status(200).json(scores);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des notes" });
  }
};
