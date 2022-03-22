//SPDX-License-Identifier:GPL-3.0
//v0.1 du programme
pragma solidity ^0.8.13;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
contract Voting is Ownable{

/*==================EVENEMENTS==================*/
    event VoterRegistered       (address voterAddress);
    event WorkflowStatusChange  (WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered    (uint proposalId);
    event Voted                 (address voter, uint proposalId);
/*==============================================*/

/*==================ENUMS==================*/
    enum WorkflowStatus {RegisteringVoters,ProposalsRegistrationStarted,ProposalsRegistrationEnded,VotingSessionStarted,VotingSessionEnded,VotesTallied}
/*========================================*/

/*==================STRUCTURES==================*/
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }
/*==============================================*/

/*==================MAPPINGS==================*/
    mapping(address=>Voter) VoterList;
/*============================================*/

/*==================VARIABLES==================*/
    Proposal[]      Proposals;          //tableau de structures de type Proposal
    WorkflowStatus  status;             //permet d'enregistrer l'ID de l'étape de la session de vote

        //variable pour la fonctionnalité additionnelle 1 part.1/3 (non demandée dans le projet):  liste des adresses des votants
            address[]       AddressListVoters;
        //fin de la fonctionnalité additionnelle 1/3

/*=============================================*/

/*==================METHODES==================*/

    /********************déplacement dans les étapes du vote********************/
        function nextStep() public onlyOwner{
            require(status<type(WorkflowStatus).max, "Impossible : You are already at the last status");
            WorkflowStatus previousStatus   = status;
            status                          = WorkflowStatus(uint(status)+1);
            WorkflowStatus newStatus        = status;
            emit WorkflowStatusChange(previousStatus, newStatus);
        }
        function previousStep() public onlyOwner{
            require(status>type(WorkflowStatus).min, "Impossible : You are already at the first status");
            WorkflowStatus previousStatus   = status;
            status                          = WorkflowStatus(uint(status)-1);
            WorkflowStatus newStatus        = status;
            emit WorkflowStatusChange(previousStatus, newStatus);
        }
        function getActualStatus() public view returns (WorkflowStatus){
            return status;  //retourne le status actuel du vote
        }    
    /***************************************************************************/

    /********************Autour des propositions********************/
        function setProposal(string memory _proposal) public onlyOwner{
            require(status == WorkflowStatus.ProposalsRegistrationStarted, "Impossible : Not in \"Proposal Registration\" Session");
            Proposals.push(Proposal(_proposal,0));
            emit ProposalRegistered(Proposals.length); //retourne le dernier enregistrement du tableau (servant d'ID)
        }

        /* fonction non opérationnelle en cours de dev
        function removeLastProposal() public onlyOwner{
            require(status == WorkflowStatus.ProposalsRegistrationStarted, "Impossible : Not in \"Proposal Registration\" Session");
            require(Proposals.length>0,                                    "Impossible : Proposal list is Empty");
            Proposals.pop;
        }
        */
        function getProposals() public view returns (Proposal[] memory){
            return Proposals;
        }
    /**************************************************************/

    /********************Autour des votants********************/
        function setVoters(address _voter) public onlyOwner{
            require(status == WorkflowStatus.RegisteringVoters, "Impossible : Not in \"Registering Voters\" Session");  //permet de vérifier si on se trouve sur la session d'ajout des votants.
            require( _voter != address(0),                      "Impossible : Invalid adress");                         //vérifie si l'adresse saisie est valide
            require(VoterList[_voter].isRegistered == false,    "Impossible : Voter already registered");               //vérifie si l'adresse n'est pas déjà enregistrée

            VoterList[_voter] = Voter({isRegistered:true,hasVoted:false,votedProposalId:0});                            //Ajoute l'adresse à la liste des Voteurs avec des paramètres par défaut (true, false et 0)

                //fonctionnalité additionnelle 1 part.2/3 : ajout du votant dans le tableau
                    AddressListVoters.push(_voter);  
                //fin de fonctionnalité additionnelle 2/3

            emit VoterRegistered(_voter); //retourne l'adresse ajoutée à la liste des votants autorisés
        }
        //fonctionnalité additionnelle 1 part 3/3 : affichage de la liste des votants
        function getVoters()public view returns (address[] memory){
            return AddressListVoters;
        }
        //fin de fonctionnalité additionnelle 3/3

        function setVote(uint _votedProposalId) external {
            require(status == WorkflowStatus.VotingSessionStarted,  "Impossible : Not in \"Voting\" Session");              //permet de vérifier si on se trouve sur la session de vote.
            require(VoterList[msg.sender].isRegistered == true,     "Impossible : The votant is not registered");           //vérifie si l'adresse saisie est valide
            require(VoterList[msg.sender].hasVoted == false,        "Impossible : You have already submited your vote");    //vérifie si l'adresse n'est pas déjà enregistrée

            Proposals[_votedProposalId].voteCount++;                    //incrémentation du nombre de votes pour cette proposition

            VoterList[msg.sender].votedProposalId = _votedProposalId;   //on indique dans la structure Voter pour qui a voté le votant
            VoterList[msg.sender].hasVoted = true;                      //on passe la variable "a voté" à true pour éviter les doublons de votes
            emit Voted (msg.sender, _votedProposalId);                  //affichage du message de qui à voté et pour qui
        }
        //fonction qui retourne les informations concernant un voteur d'après son adresse:
        function VoterInformations(address _voter) public view returns (Voter memory){
            require(status >= WorkflowStatus.VotingSessionEnded, "Impossible : Not in \"Ending vote\" Session");  //permet de vérifier si on se trouve sur la session d'ajout des votants.
            require( _voter != address(0),                      "Impossible : Invalid adress");                         //vérifie si l'adresse saisie est valide
            require(VoterList[msg.sender].isRegistered == true,  "Impossible : The votant is not registered");           //vérifie si l'adresse saisie est valide

            return VoterList[_voter];
        }
    /**********************************************************/

    /**************Affichage du gagnant**************/
        function getWinner()public view returns (Proposal memory){
            require(status==WorkflowStatus.VotesTallied, "Impossible : Not in \"Votes Tailled\" Session");  //permet de vérifier si on se trouve sur la session de résultat du vote.

            uint nbVote=0;              //on passe par une variable temporaire permettant de récuperer le nombre de votes lors du passage en revue du tableau Proposals                    
            uint winningProposalId=0;   //on passe par une deuxième variable temporaire pour récupérer l'ID de la proposition ayant le plus de votes    
            for (uint i=0;i<Proposals.length;i++){
                if(Proposals[i].voteCount>nbVote){
                    nbVote=Proposals[i].voteCount;
                    winningProposalId=i;
                }
                /*Reste à introduire la réaction du programme face à une égalité de vote*/
            }
            return Proposals[winningProposalId];    //affichage du gagant
        }
    /************************************************/

/*============================================*/

/*==================TO DO LIST==================*/
    /**

    v0.2:

    permettre aux votants de changer leur vote
    permettre au votants d'afficher les votes des autres adresses
    prendre en compte l'égalité de 2 votes



    **/
/*==============================================*/
}
