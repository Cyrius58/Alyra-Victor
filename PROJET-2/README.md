# TESTS REALIZED :
__Total unit test count : 22__
## 1. About voters :

### 1. Set (addVoter function):

- Check if the address is already registered;
- Check if the value &quot;hasVoted&quot; is well set to default value &quot;false&quot;;
- Check if the value &quot;votedProposalId&quot; is well set to default value &quot;0&quot;;
- Check if returns correctly the value &quot;votedProposalId&quot;;

### 2. Get (getVoter function):

- Check if returns correctly the value &quot;isRegistered&quot;;
- Check if returns correctly the value &quot;hasVoted;
- Check if returns correctly the value &quot;votedProposalId&quot;;

### 3. Event (linked with addVoter function):

- Check if event correctly send the address of the voter registered.

### 4. Revert (linked to addVoter function with different statuses):

- Check if addVoter reverts when WorkflowStatus is not in the &quot;Voters registration&quot; session. (4 hooks);

## 2. About onlyOwner/onlyVoters:

### 1. onlyOwner:
- Added 6 revert checkings around the functions modified with onlyOwner;

### 2. onlyVoters:
- Added 4 revert checkings around the functions modified with onlyVoters;


## 3. To do:

### 1. Factorization of tests
- Factorize tests related to workflowstatus using the "const WorkflowStatus".
- At the moment the code stays like this to respect the current objective to test really all unit test.

### 2. Develop the tests to other functions:
- function setVote() (test if the voter is registered, if the workflowstatus is to "VotingSessionStarted", if the voter has already voted or not, if the proposal he tries to vote for is registered or not, test the event "Voted"...)
- function addProposal() (test if the workflow status is to "ProposalsRegistrationStarted",if the user is allowed or not to register a proposal, if the proposal is reverted in case of blank submitting, test the event "ProposalRegistrered", test if the push in the proposalsArray works...)
- function getVoter() (test if the function returns the correct address)
- function getProposal() (test if the function returns the correct proposal asociated with the correct id)
- function getWinner() (test if the WorkflowStatus is to "VotesTallied", test if the winningProposals returns the correct vallue)
- function tallyVotesDraw() (test if the WorkflowStatus is to "VotingSessionEnded", test if the "winningProposalsID" and "winningProposals" pushes works, test the event "WorkflowStatusChange")
