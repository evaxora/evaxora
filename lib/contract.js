import { baseSepolia } from 'wagmi/chains';

export const REGISTRY_ADDRESS = '0x7Ee0f29DBBc1b9826eaD2461C6f52a3BB66dEB36';

export const REGISTRY_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'EvaluatorDeactivated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'enum EvaxoraRegistry.EvalType', name: 'evalType', type: 'uint8' },
      { indexed: false, internalType: 'string', name: 'domain', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'EvaluatorRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'addr', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'verified', type: 'bool' },
    ],
    name: 'EvaluatorVerified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'evaluatorCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllEvaluators',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'addr', type: 'address' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'enum EvaxoraRegistry.EvalType', name: 'evalType', type: 'uint8' },
          { internalType: 'string', name: 'domain', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'registeredAt', type: 'uint256' },
          { internalType: 'bool', name: 'verified', type: 'bool' },
          { internalType: 'bool', name: 'active', type: 'bool' },
        ],
        internalType: 'struct EvaxoraRegistry.Evaluator[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
    name: 'getEvaluator',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'addr', type: 'address' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'enum EvaxoraRegistry.EvalType', name: 'evalType', type: 'uint8' },
          { internalType: 'string', name: 'domain', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'registeredAt', type: 'uint256' },
          { internalType: 'bool', name: 'verified', type: 'bool' },
          { internalType: 'bool', name: 'active', type: 'bool' },
        ],
        internalType: 'struct EvaxoraRegistry.Evaluator',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveEvaluators',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'addr', type: 'address' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'enum EvaxoraRegistry.EvalType', name: 'evalType', type: 'uint8' },
          { internalType: 'string', name: 'domain', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'registeredAt', type: 'uint256' },
          { internalType: 'bool', name: 'verified', type: 'bool' },
          { internalType: 'bool', name: 'active', type: 'bool' },
        ],
        internalType: 'struct EvaxoraRegistry.Evaluator[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isRegistered',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'enum EvaxoraRegistry.EvalType', name: '_evalType', type: 'uint8' },
      { internalType: 'string', name: '_domain', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' },
    ],
    name: 'registerEvaluator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_addr', type: 'address' },
      { internalType: 'bool', name: '_verified', type: 'bool' },
    ],
    name: 'setVerified',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// EvalType enum mapping
export const EVAL_TYPES = {
  0: 'AI Agent',
  1: 'ZK Verifier',
  2: 'Multi-sig',
  3: 'DAO',
};

export const EVAL_TYPE_IDS = {
  'ai-agent': 0,
  'zk-verifier': 1,
  'multi-sig': 2,
  'dao': 3,
};

export const CHAIN = baseSepolia;

// ── AgenticCommerce (ERC-8183 Jobs) ──

export const ACP_ADDRESS = '0xD1fF30c1bFd3a5D82B741f603F56b6EbD0D67a0B';

export const ACP_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'jobCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_jobId', type: 'uint256' }],
    name: 'getJob',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'address', name: 'client', type: 'address' },
          { internalType: 'address', name: 'provider', type: 'address' },
          { internalType: 'address', name: 'evaluator', type: 'address' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'budget', type: 'uint256' },
          { internalType: 'uint256', name: 'expiredAt', type: 'uint256' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'address', name: 'paymentToken', type: 'address' },
        ],
        internalType: 'struct AgenticCommerce.Job',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_provider', type: 'address' },
      { internalType: 'address', name: '_evaluator', type: 'address' },
      { internalType: 'uint256', name: '_expiredAt', type: 'uint256' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'address', name: '_paymentToken', type: 'address' },
      { internalType: 'uint256', name: '_budget', type: 'uint256' },
    ],
    name: 'createJob',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events for stats
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'jobId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'evaluator', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'reason', type: 'bytes32' },
    ],
    name: 'JobCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'jobId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'rejector', type: 'address' },
      { indexed: false, internalType: 'bytes32', name: 'reason', type: 'bytes32' },
    ],
    name: 'JobRejected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'jobId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'client', type: 'address' },
      { indexed: true, internalType: 'address', name: 'provider', type: 'address' },
      { indexed: false, internalType: 'address', name: 'evaluator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'expiredAt', type: 'uint256' },
    ],
    name: 'JobCreated',
    type: 'event',
  },
];

export const JOB_STATUSES = {
  0: 'Open',
  1: 'Funded',
  2: 'Submitted',
  3: 'Completed',
  4: 'Rejected',
  5: 'Expired',
};

export const JOB_STATUS_CLASSES = {
  0: 's-open',
  1: 's-funded',
  2: 's-submitted',
  3: 's-completed',
  4: 's-rejected',
  5: 's-expired',
};
