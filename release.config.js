// release.config.js
module.exports = {
  branches: ["main"],
  releaseRules: [
    { type: "feat", release: "minor" },
    { type: "fix", release: "patch" },
    { breaking: true, release: "major" },

  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    ["@semantic-release/npm", {
      npmPublish: false, // Set true if you want to publish to npm
    }],

    ["@semantic-release/git", {
      assets: ["CHANGELOG.md", "package.json"],
      message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    }],
    
    "@semantic-release/github"
  ],
};
