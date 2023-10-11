
const handleGithubAUth = (req,res) => {
        // Successful GitHub authentication, generate a JWT token
        const token = req.user;
        if (token) {
          // Redirect to a client page with the token or send it as a JSON response
          res.json({ token });
        } else {
          // Handle authentication failure
          res.status(401).json({ message: "Authentication failed" });
        }

}

module.exports = handleGithubAUth;
