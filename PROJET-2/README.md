# TESTS REALIZED :

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
- Added 4 revert checkings around the functions modified with onlyVoters;
