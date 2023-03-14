module.exports = {
  transform: {"^.+\\.ts?$": "ts-jest"},
  testEnvironment: "jsdom",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  reporters: [["default", {summaryThreshold: 0}]],
};
