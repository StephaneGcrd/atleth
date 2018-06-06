module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    live: {
      host: "51.38.48.44", // Random IP for example purposes (do not use)
      port: 8546,
      network_id: "18141997",        // Ethereum public network
      from: "0xeDa97C9807fb95998D99E78490514C57354137a7"
    }
  }
};
