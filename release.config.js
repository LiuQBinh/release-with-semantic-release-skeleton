// release.config.js
module.exports = {
    branches: ["main"], // hoặc "master" nếu bạn dùng tên này
    plugins: [
        "@semantic-release/commit-analyzer", // Phân tích commit để xác định loại version
        "@semantic-release/release-notes-generator", // Tạo ghi chú phát hành
        "@semantic-release/changelog", // Cập nhật CHANGELOG.md
        "@semantic-release/npm", // Tăng version package.json & publish lên npm
        [
            "@semantic-release/git",
            {
                assets: ["package.json", "CHANGELOG.md"],
                message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
        ],
        "@semantic-release/github", // Tạo GitHub release (tuỳ chọn)
    ],
};
