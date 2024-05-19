Generate in @tests-ERR.test.ts the unit tests covering all the different scenarios of the functions defined in @validator.ts 


The only function that is meant to be tested from @validator.ts is @validateCandidateData . Refactor the unit tests you have generated to test only the public function. I want to keep the different scenarios you have created, keep asserting the error messages that are expected too

could you make the code smaller by having the same input that is cloned for each different scenario and only modifying the field that changes for each scenario? Also it is missing a lot of cases, that you created from the first prompt; for example, for `validateName` you had 4 cases in error

@tests-ERR.test.ts the scenario where the CV is validated should also validate that the file format is either PDF or DOCX. Can you also add positive and failing scenarios to cover this?

add extra scenarios into @tests-ERR.test.ts  to test the whole component @candidateService.ts 

Can you make those tests in a way that the access to the database is mocked? This is actually happening in @Candidate.ts 

## debugging compilation errors on the testing part
(on prismaMocks.ts) >> For the code present, we get this error:
```
',' expected.
```
How can I resolve this? If you propose a fix, please make it concise.

this mock @prismaMocks.ts  is not correctly working because scenarios in @tests-ERR.test.ts using prisma indirectly are still trying to connect to real DB. What is wrong in this code?

still it is not working, how can I fix this error:

          104 |                 if (error instanceof Prisma.PrismaClientInitializationError) {
          105 |                     // Database connection error
        > 106 |                     throw new Error(error.message);
              |                           ^
          107 |                 } else {
          108 |                     throw error;
          109 |                 }

          at Candidate.<anonymous> (src/domain/models/Candidate.ts:106:27)
          at step (src/domain/models/Candidate.ts:33:23)
          at Object.throw (src/domain/models/Candidate.ts:14:53)
          at rejected (src/domain/models/Candidate.ts:6:65)
