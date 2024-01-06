export default function Routes(app, game) {
  app.get("/", (req, res) => {
    console.log("GET /");
    res.status(200).json({ message: "Welcome to Tic Tac Toe!" });
  });

  app.get("/health-check", (req, res) => {
    console.log("GET /health-check");
    res.status(200).json({ message: "Server is up and running!" });
  });

  // RESTful API endpoints...
  app.post("/join", (req, res) => {
    // Handle joining the game...
    const { username } = req.body;

    if (username && game.addPlayer(username)) {
      return res.status(200).json({ message: "Successfully joined the game." });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    return res.status(400).json({ message: "Failed to join the game." });
  });

  app.put("/move", (req, res) => {
    // Handle making a move...
    const { username, position } = req.body;

    console.log("PUT /move", { username, position });

    const playerIndex = game.players.indexOf(username);

    console.log("playerIndex", playerIndex);

    if (game.makeMove(playerIndex, position)) {
      console.log("game.getCurrentState()", game.getCurrentState());

      // TO-DO: Handle game state response...
      return res.status(200).json({
        message: "Successfully made a move.",
        state: game.getCurrentState(),
      });
    }

    console.log("Bad request...");

    return res.status(400).json({
      message: "Failed to make a move.",
      state: game.getCurrentState(),
    });
  });

  app.get("/state", (req, res) => {
    // Handle getting the game state...
    res.status(200).json(game.getCurrentState());
  });
}
