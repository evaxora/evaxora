// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AgenticCommerce (Simplified)
 * @notice Simplified ERC-8183 Job escrow for Evaxora demo.
 *         Core state machine: Open → Funded → Submitted → Completed | Rejected | Expired.
 */
contract AgenticCommerce {
    enum JobStatus { Open, Funded, Submitted, Completed, Rejected, Expired }

    struct Job {
        uint256 id;
        address client;
        address provider;
        address evaluator;
        string description;
        uint256 budget;
        uint256 expiredAt;
        JobStatus status;
        address paymentToken;
    }

    address public owner;
    mapping(uint256 => Job) public jobs;
    uint256 public jobCounter;

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, uint256 expiredAt);
    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event JobSubmitted(uint256 indexed jobId, address indexed provider, bytes32 deliverable);
    event JobCompleted(uint256 indexed jobId, address indexed evaluator, bytes32 reason);
    event JobRejected(uint256 indexed jobId, address indexed rejector, bytes32 reason);
    event JobExpired(uint256 indexed jobId);
    event Refunded(uint256 indexed jobId, address indexed client, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() {
        owner = msg.sender;
    }

    function createJob(
        address _provider,
        address _evaluator,
        uint256 _expiredAt,
        string calldata _description,
        address _paymentToken,
        uint256 _budget
    ) external returns (uint256) {
        require(_evaluator != address(0), "Evaluator required");
        require(_expiredAt > block.timestamp, "Expiry in past");

        uint256 jobId = ++jobCounter;
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            provider: _provider,
            evaluator: _evaluator,
            description: _description,
            budget: _budget,
            expiredAt: _expiredAt,
            status: JobStatus.Open,
            paymentToken: _paymentToken
        });

        emit JobCreated(jobId, msg.sender, _provider, _evaluator, _expiredAt);
        return jobId;
    }

    function fund(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.id != 0, "Invalid job");
        require(job.status == JobStatus.Open, "Wrong status");
        require(msg.sender == job.client, "Not client");
        require(job.provider != address(0), "No provider");

        job.status = JobStatus.Funded;
        if (job.budget > 0 && job.paymentToken != address(0)) {
            IERC20(job.paymentToken).transferFrom(msg.sender, address(this), job.budget);
        }
        emit JobFunded(_jobId, job.client, job.budget);
    }

    function submit(uint256 _jobId, bytes32 _deliverable) external {
        Job storage job = jobs[_jobId];
        require(job.id != 0, "Invalid job");
        require(job.status == JobStatus.Funded, "Wrong status");
        require(msg.sender == job.provider, "Not provider");

        job.status = JobStatus.Submitted;
        emit JobSubmitted(_jobId, job.provider, _deliverable);
    }

    function complete(uint256 _jobId, bytes32 _reason) external {
        Job storage job = jobs[_jobId];
        require(job.id != 0, "Invalid job");
        require(job.status == JobStatus.Submitted, "Wrong status");
        require(msg.sender == job.evaluator, "Not evaluator");

        job.status = JobStatus.Completed;

        if (job.budget > 0 && job.paymentToken != address(0)) {
            IERC20(job.paymentToken).transfer(job.provider, job.budget);
        }
        emit JobCompleted(_jobId, job.evaluator, _reason);
    }

    function reject(uint256 _jobId, bytes32 _reason) external {
        Job storage job = jobs[_jobId];
        require(job.id != 0, "Invalid job");

        if (job.status == JobStatus.Open) {
            require(msg.sender == job.client, "Not client");
        } else if (job.status == JobStatus.Funded || job.status == JobStatus.Submitted) {
            require(msg.sender == job.evaluator, "Not evaluator");
        } else {
            revert("Wrong status");
        }

        JobStatus prev = job.status;
        job.status = JobStatus.Rejected;

        if ((prev == JobStatus.Funded || prev == JobStatus.Submitted) && job.budget > 0 && job.paymentToken != address(0)) {
            IERC20(job.paymentToken).transfer(job.client, job.budget);
            emit Refunded(_jobId, job.client, job.budget);
        }
        emit JobRejected(_jobId, msg.sender, _reason);
    }

    function claimRefund(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.id != 0, "Invalid job");
        require(job.status == JobStatus.Funded || job.status == JobStatus.Submitted, "Wrong status");
        require(block.timestamp >= job.expiredAt, "Not expired");

        job.status = JobStatus.Expired;

        if (job.budget > 0 && job.paymentToken != address(0)) {
            IERC20(job.paymentToken).transfer(job.client, job.budget);
            emit Refunded(_jobId, job.client, job.budget);
        }
        emit JobExpired(_jobId);
    }

    // ── View ──
    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }
}
