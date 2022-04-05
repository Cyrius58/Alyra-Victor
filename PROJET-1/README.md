# ⚡️ Projet - Système de vote

Un smart contract de vote peut être simple ou complexe, selon les exigences des élections que vous souhaitez soutenir. Le vote peut porter sur un petit nombre de propositions (ou de candidats) présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes.

Dans ce cadres, vous allez écrire un smart contract de vote pour une petite organisation. Les électeurs, que l&#39;organisation connaît tous, sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, peuvent soumettre de nouvelles propositions lors d&#39;une session d&#39;enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

✔️Le vote n&#39;est pas secret
✔️ Chaque électeur peut voir les votes des autres
✔️ Le gagnant est déterminéà la majorité simple
✔️ La proposition qui obtient le plus de voix l&#39;emporte.

👉 Le processus de vote :

Voici le déroulement de l&#39;ensemble du processus de vote :

- L&#39;administrateur du vote enregistre une liste blanche d&#39;électeurs identifiés par leur adresse Ethereum.
- L&#39;administrateur du vote commence la session d&#39;enregistrement de la proposition.
- Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d&#39;enregistrement est active.
- L&#39;administrateur de vote met fin à la session d&#39;enregistrement des propositions.
- L&#39;administrateur du vote commence la session de vote.
- Les électeurs inscrits votent pour leur proposition préférée.
- L&#39;administrateur du vote met fin à la session de vote.
- L&#39;administrateur du vote comptabilise les votes.
- Tout le monde peut vérifier les derniers détails de la proposition gagnante.

👉Les recommandations et exigences :

- Votre smart contract doit s&#39;appeler &quot;Voting&quot;.
- Votre smart contract doit utiliser la dernière version du compilateur.
- L&#39;administrateur est celui qui va déployer le smart contract.
- Votre smart contract doit définir les structures de données suivantes :

- structVoter {
- bool isRegistered;
- bool hasVoted;
- uint votedProposalId;
- }
- structProposal {
- string description;
- uint voteCount;

}

- Votre smart contract doit définir une énumération qui gère les différents états d&#39;un vote

- enum WorkflowStatus {
- RegisteringVoters,
- ProposalsRegistrationStarted,
- ProposalsRegistrationEnded,
- VotingSessionStarted,
- VotingSessionEnded,
- VotesTallied

}

- Votre smart contract doit définir un uint winningProposalId qui représente l&#39;id du gagnant ou une fonction getWinner qui retourne le gagnant.
- Votre smart contract doit importer le smart contract la librairie &quot;[Ownable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol)&quot; d&#39;OpenZepplin.
- Votre smart contract doit définir les événements suivants :

event VoterRegistered(address voterAddress);
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted (address voter, uint proposalId);

📌Votre formateur attends :

1. Lien vers Github
