const Voting = artifacts.require("./Voting.sol");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect, assert}=require('chai');

contract("Voting",accounts=>{
    const owner         = accounts[0];
    const second        = accounts[1];
    const third         = accounts[2];
    const notRegistered = accounts[9];

    const WorkflowStatus = [
        {value: 0,  name: 'RegisteringVoters',            },
        {value: 1,  name: 'ProposalsRegistrationStarted', },
        {value: 2,  name: 'ProposalsRegistrationEnded',   },
        {value: 3,  name: 'VotingSessionStarted',         },
        {value: 4,  name: 'VotingSessionEnded',           },
        {value: 5,  name: 'VotesTallied',                 },
    ];

    //Instanciate the 'Voting' contract
    let votingInstance;

    describe ("Tests about voters :",function (){
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
        context("Events :",function(){
            before(async function(){
                votingInstance=await Voting.new({from:owner});
            });
            it("...should return an event with voter address", async()=>{
                const findEvent = await votingInstance.addVoter(owner,{from:owner});
                expectEvent(findEvent,"VoterRegistered",0,owner);
            });
        });
        context("Revert because of current status :",function(){
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
            context("after Voting",function(){
                before(async function (){
                    votingInstance=await Voting.new({from:owner});
                    await votingInstance.startProposalsRegistering();
                    await votingInstance.endProposalsRegistering();
                    await votingInstance.startVotingSession();
                });
                
                it("...should revert if in endVotingSession session", async ()=>{
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
    describe("Testing on user status:", function () {
        before(async () => {
            votingInstance = await Voting.new({from:owner});
        });
        context("onlyOwner:",function (){
            it("...sould revert on addVoter", async () => {
                await expectRevert(votingInstance.addVoter(second,          {from: second}), "Ownable: caller is not the owner");});
            it("...sould revert on StartProposalRegistering", async () => {
                await expectRevert(votingInstance.startProposalsRegistering({from: second}), "Ownable: caller is not the owner");});
            it("...sould revert on endProposalsRegistering", async () => {
                await expectRevert(votingInstance.endProposalsRegistering(  {from: second}), "Ownable: caller is not the owner");});
            it("...sould revert on startVotingSession", async () => {
                await expectRevert(votingInstance.startVotingSession(       {from: second}), "Ownable: caller is not the owner");});
            it("...sould revert on endVotingSession", async () => {
                await expectRevert(votingInstance.endVotingSession(         {from: second}), "Ownable: caller is not the owner");});
            it("...sould revert on tallyVotes", async () => {
                await expectRevert(votingInstance.tallyVotesDraw(           {from: second}), "Ownable: caller is not the owner");});
        });
        context("onlyVoters:",function (){
            it("...sould revert on getVoter", async () => {
                await expectRevert(votingInstance.getVoter(owner,           {from: notRegistered}), "You're not a voter");});
            it("...sould revert on getOneProposal", async () => {
                await expectRevert(votingInstance.getOneProposal(0,         {from: notRegistered}), "You're not a voter");});
            it("...sould revert on addProposal", async () => {
                await expectRevert(votingInstance.addProposal("test",       {from: notRegistered}), "You're not a voter");});
            it("...sould revert on setVote", async () => {
                await expectRevert(votingInstance.setVote(0,                {from: notRegistered}), "You're not a voter");});  
        });
    });




    describe("tests about proposals",function(){
        before(async function(){
            votingInstance=await Voting.new({from:owner});
            await votingInstance.addVoter(owner,{from:owner});

            context("Set :",function(){

            });
            context("Get :",function(){
                
            });
        });

    });
});

//https://mochajs.org/#hooks
