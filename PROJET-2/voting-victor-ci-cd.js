const Voting = artifacts.require("./Voting.sol");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect}=require('chai');

contract("Voting",accounts=>{
    const owner         = accounts[0];
    const voter1        = accounts[1];
    const notRegistered = accounts[9];

  /**  
  *  const WorkflowStatus = [
  *      {value: 0,  name: 'RegisteringVoters',            },
  *      {value: 1,  name: 'ProposalsRegistrationStarted', },
  *      {value: 2,  name: 'ProposalsRegistrationEnded',   },
  *      {value: 3,  name: 'VotingSessionStarted',         },
  *      {value: 4,  name: 'VotingSessionEnded',           },
  *      {value: 5,  name: 'VotesTallied',                 },
  *  ];
  */
    
    //Instanciate the 'Voting' contract
    let votingInstance;

    describe ("Tests about voters :",function (){
        //tests around the set functionality
        context("Set :",function(){
            beforeEach(async function (){
                votingInstance=await Voting.new({from:owner});
                await votingInstance.addVoter(owner,{from:owner});
            });
            it("...should register a voter \"isRegistered\" status as true", async ()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(storedData.isRegistered).to.be.true;
            });
            it("...should register a voter with false value in \"has voted\"", async ()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(storedData.hasVoted).to.be.false;
            });
            it("...should register a voter with 0 value in \"votedProposalId\"", async ()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(new BN(storedData.votedProposalId)).to.be.bignumber.equal(new BN(0));
            });      
            it("...should revert if user is already registered as voter", async ()=>{
                await expectRevert(votingInstance.addVoter(owner,{from:owner}),"Already registered");
            }); 
        })
        //tests around the get functionality
        context("Get :",function(){
            before(async function(){
                votingInstance=await Voting.new({from:owner});
                await votingInstance.addVoter(owner,{from:owner});
            });
            it("...should return a voter registrated status \"isRegistred\" as true", async()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(storedData.hasVoted).to.be.false;
            });
            it("...should return a voter with false value in \"hasVoted\"", async ()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(storedData.hasVoted).to.be.false;
            });
            it("...should return a voter with 0 value in \"votedProposalId\"", async ()=>{
                const storedData = await votingInstance.getVoter(owner);
                expect(new BN(storedData.votedProposalId)).to.be.bignumber.equal(new BN(0));
            }); 
        });
        //tests around the event functionality
        context("Events :",function(){
            before(async function(){
                votingInstance=await Voting.new({from:owner});
            });
            it("...should return an event with voter address", async()=>{
                const findEvent = await votingInstance.addVoter(owner,{from:owner});
                expectEvent(findEvent,"VoterRegistered",0,owner);
            });
        });
        //it could be usefull to factorize this section for unit tests
        context("Revert because of current status :",function(){
            //tests around the WorkflowStatus functionality BEFORE the voting session
            context("Before Voting",function(){
                before(async function (){
                    votingInstance=await Voting.new({from:owner});
                });
                
                it("...should revert if in startProposalsRegistering session", async ()=>{
                    await votingInstance.startProposalsRegistering();
                    await expectRevert(votingInstance.addVoter(owner,{from:owner}),"Voters registration is not open yet");
                });
                
                it("...should revert if in endProposalsRegistering session", async ()=>{
                    await votingInstance.endProposalsRegistering();
                    await expectRevert(votingInstance.addVoter(owner,{from:owner}),"Voters registration is not open yet");
                });
            });
            //tests around the WorkflowStatus functionality DURING and AFTER the voting session
            context("after Voting",function(){
                before(async function (){
                    votingInstance=await Voting.new({from:owner});
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                });
                it("...should revert if in endVotingSession", async ()=>{
                    await votingInstance.endVotingSession();
                    await expectRevert(votingInstance.addVoter(owner,{from:owner}),"Voters registration is not open yet");
                });
                it("...should revert if in tallyVotesDraw session", async ()=>{
                    await votingInstance.tallyVotesDraw();
                    await expectRevert(votingInstance.addVoter(owner,{from:owner}),"Voters registration is not open yet");
                });
            });
        });
    });
    //tests around users status
    describe("Testing on users status:", function () {
        before(async () => {
            votingInstance = await Voting.new({from:owner});
        });
        //here are the tests to check if the user interacting with the smart contract can use functions midified with onlyOwner:
        context("onlyOwner:",function (){
            it("...sould revert on addVoter", async () => {
                await expectRevert(votingInstance.addVoter(voter1,          {from: voter1}), "Ownable: caller is not the owner");
            });
            it("...sould revert on StartProposalRegistering", async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: voter1}), "Ownable: caller is not the owner");
            });
            it("...sould revert on endProposalsRegistering", async () => {
                await expectRevert(votingInstance.endProposalsRegistering(  {from: voter1}), "Ownable: caller is not the owner");
            });
            it("...sould revert on startVotingSession", async () => {
                await expectRevert(votingInstance.startVotingSession(       {from: voter1}), "Ownable: caller is not the owner");
            });
            it("...sould revert on endVotingSession", async () => {
                await expectRevert(votingInstance.endVotingSession(         {from: voter1}), "Ownable: caller is not the owner");
            });
            it("...sould revert on tallyVotes", async () => {
                await expectRevert(votingInstance.tallyVotesDraw(           {from: voter1}), "Ownable: caller is not the owner");
            });
        });
        //same but for onlyVoters:
        context("onlyVoters:",function (){
            it("...sould revert on getVoter", async () => {
                await expectRevert(votingInstance.getVoter(owner,           {from: notRegistered}), "You're not a voter");
            });
            it("...sould revert on getOneProposal", async () => {
                await expectRevert(votingInstance.getOneProposal(0,         {from: notRegistered}), "You're not a voter");
            });
            it("...sould revert on addProposal", async () => {
                await expectRevert(votingInstance.addProposal("test",       {from: notRegistered}), "You're not a voter");
            });
            it("...sould revert on setVote", async () => {
                await expectRevert(votingInstance.setVote(0,                {from: notRegistered}), "You're not a voter");
            });  
        });
    });

/**
*    describe("tests about proposals",function(){
*        before(async function(){
*            votingInstance=await Voting.new({from:owner});
*            await votingInstance.addVoter(owner,{from:owner});
*
*            context("Set :",function(){
*
*            });
*            context("Get :",function(){
*                
*            });
*        });
*
*    });
*/
    
});
