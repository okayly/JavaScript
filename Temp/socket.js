{ io: 
   { nsps: { '/': [Circular] },
     subs: [ [Object], [Object], [Object] ],
     opts: 
      { path: '/socket.io',
        hostname: '192.168.0.63',
        secure: false,
        port: '7953' },
     _reconnection: true,
     _reconnectionAttempts: Infinity,
     _reconnectionDelay: 1000,
     _reconnectionDelayMax: 5000,
     _randomizationFactor: 0.5,
     backoff: { ms: 1000, max: 5000, factor: 2, jitter: 0.5, attempts: 0 },
     _timeout: 20000,
     readyState: 'opening',
     uri: 'http://172.20.70.61:7953',
     connecting: [ [Circular] ],
     lastPing: null,
     encoding: false,
     packetBuffer: [],
     encoder: {},
     decoder: { reconstructor: null },
     autoConnect: true,
     engine: 
      { secure: false,
        agent: false,
        hostname: '192.168.0.63',
        port: '7953',
        query: {},
        upgrade: true,
        path: '/socket.io/',
        forceJSONP: false,
        jsonp: true,
        forceBase64: false,
        enablesXDR: false,
        timestampParam: 't',
        timestampRequests: undefined,
        transports: [Object],
        readyState: 'opening',
        writeBuffer: [],
        policyPort: 843,
        rememberUpgrade: false,
        binaryType: null,
        onlyBinaryUpgrades: undefined,
        perMessageDeflate: [Object],
        pfx: null,
        key: null,
        passphrase: null,
        cert: null,
        ca: null,
        ciphers: null,
        rejectUnauthorized: true,
        transport: [Object],
        _callbacks: [Object] },
     skipReconnect: false,
     _callbacks: { '$open': [Object], '$packet': [Object], '$close': [Object] } },
  nsp: '/',
  json: [Circular],
  ids: 0,
  acks: {},
  receiveBuffer: [],
  sendBuffer: [],
  connected: false,
  disconnected: true,
  subs: 
   [ { destroy: [Function] },
     { destroy: [Function] },
     { destroy: [Function] } ],
  _callbacks: 
   { '$connecting': [ [Function: onConnecting] ],
     '$connect': [ [Function] ] } }