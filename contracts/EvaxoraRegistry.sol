// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EvaxoraRegistry
 * @notice On-chain evaluator registry for ERC-8183 agentic commerce.
 *         Anyone can register as an evaluator. Owner can verify evaluators.
 */
contract EvaxoraRegistry {
    // ── Types ──
    enum EvalType { AIAgent, ZKVerifier, MultiSig, DAO }

    struct Evaluator {
        address addr;
        string name;
        EvalType evalType;
        string domain;
        string description;
        uint256 registeredAt;
        bool verified;
        bool active;
    }

    // ── State ──
    address public owner;
    uint256 public evaluatorCount;

    mapping(address => Evaluator) public evaluators;
    address[] public evaluatorList;
    mapping(address => bool) public isRegistered;

    // ── Events ──
    event EvaluatorRegistered(
        address indexed addr,
        string name,
        EvalType evalType,
        string domain,
        uint256 timestamp
    );
    event EvaluatorVerified(address indexed addr, bool verified);
    event EvaluatorDeactivated(address indexed addr);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Modifiers ──
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ── Constructor ──
    constructor() {
        owner = msg.sender;
    }

    // ── Registration ──
    function registerEvaluator(
        string calldata _name,
        EvalType _evalType,
        string calldata _domain,
        string calldata _description
    ) external {
        require(!isRegistered[msg.sender], "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_domain).length > 0, "Domain required");

        Evaluator memory eval_ = Evaluator({
            addr: msg.sender,
            name: _name,
            evalType: _evalType,
            domain: _domain,
            description: _description,
            registeredAt: block.timestamp,
            verified: false,
            active: true
        });

        evaluators[msg.sender] = eval_;
        evaluatorList.push(msg.sender);
        isRegistered[msg.sender] = true;
        evaluatorCount++;

        emit EvaluatorRegistered(msg.sender, _name, _evalType, _domain, block.timestamp);
    }

    // ── Admin ──
    function setVerified(address _addr, bool _verified) external onlyOwner {
        require(isRegistered[_addr], "Not registered");
        evaluators[_addr].verified = _verified;
        emit EvaluatorVerified(_addr, _verified);
    }

    function deactivateEvaluator(address _addr) external {
        require(msg.sender == _addr || msg.sender == owner, "Not authorized");
        require(isRegistered[_addr], "Not registered");
        evaluators[_addr].active = false;
        emit EvaluatorDeactivated(_addr);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    // ── View functions ──
    function getEvaluator(address _addr) external view returns (Evaluator memory) {
        require(isRegistered[_addr], "Not registered");
        return evaluators[_addr];
    }

    function getAllEvaluators() external view returns (Evaluator[] memory) {
        Evaluator[] memory result = new Evaluator[](evaluatorList.length);
        for (uint256 i = 0; i < evaluatorList.length; i++) {
            result[i] = evaluators[evaluatorList[i]];
        }
        return result;
    }

    function getEvaluatorAtIndex(uint256 _index) external view returns (Evaluator memory) {
        require(_index < evaluatorList.length, "Index out of bounds");
        return evaluators[evaluatorList[_index]];
    }

    function getActiveEvaluators() external view returns (Evaluator[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < evaluatorList.length; i++) {
            if (evaluators[evaluatorList[i]].active) activeCount++;
        }
        Evaluator[] memory result = new Evaluator[](activeCount);
        uint256 j = 0;
        for (uint256 i = 0; i < evaluatorList.length; i++) {
            if (evaluators[evaluatorList[i]].active) {
                result[j] = evaluators[evaluatorList[i]];
                j++;
            }
        }
        return result;
    }
}
