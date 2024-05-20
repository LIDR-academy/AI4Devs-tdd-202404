# Prompts

1. Checking the @README.md and all the project content summarize the goal of the @backend folder

2. Which services do you recognize on @backend ?

3. I want you to test using JEST the whole process to create a new candidate.
First of all, which scenarios do you think are important to be tested?

4. Perfect, so, we're going to test all of the following scenarios:
    1. Successful Candidate Creation:
    Test that a candidate with valid data is successfully added to the database.
    2. Validation Failures:
    Test input validation for each field (e.g., invalid email, missing required fields like firstName or lastName).
    Ensure that the system correctly handles and returns validation errors.
    3. Database Errors:
    Simulate database failures (e.g., connection errors) and ensure that the service handles these gracefully.
    4. Duplicate Email:
    Attempt to add a candidate with an email that already exists in the database to test the unique constraint on the email field.
    5. Associated Data Integrity:
    Ensure that related data (educations, work experiences, resumes) is correctly linked to the candidate and stored properly.

    Instead of simulate the database conection, use just mocks for the necessary data. Which mocks are you going to create?

5. perfect. Do you have any doubt before start the testing integration?

    *No, I don't have any doubts. We can proceed with setting up the testing environment and implementing the tests as discussed. If any specific issues or questions arise during the testing process, I'll address them accordingly.*

6. We're going to integrate all the test on this file @tests-MPC.test.ts . Start mocking the data as we defined previously

7. This test (*first test generated*) is returning me this error:

    FAIL  src/tests/tests-MPC.test.ts
    ● Test suite failed to run

        src/tests/tests-MPC.test.ts:25:43 - error TS2339: Property 'mockResolvedValue' does not exist on type '<T extends CandidateCreateArgs<any>>(args: SelectSubset<T, CandidateCreateArgs<any>>) => Prisma__CandidateClient<GetFindResult<$CandidatePayload<any>, T>, never, any>'.

        25     prismaMock.prototype.candidate.create.mockResolvedValue({


    > Changed to:
    ```
    prismaMock.prototype.candidate.create = jest.fn().mockResolvedValue({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com"
      });
    ```

8. All these mocks need to follow the prisma structure defined on the @models folder: create, update, delete, findUnique. Fix it on @tests-MPC.test.ts 
    > Iniatilly, the assistant, just include the "create" method for all the models.

9. I'm having this issue running the test.
     FAIL  src/tests/tests-MPC.test.ts
  ● Test suite failed to run

    src/tests/tests-MPC.test.ts:16:30 - error TS2540: Cannot assign to 'candidate' because it is a read-only property.

    16         prismaMock.prototype.candidate = {
                                    ~~~~~~~~~
    src/tests/tests-MPC.test.ts:29:30 - error TS2540: Cannot assign to 'education' because it is a read-only property.

    29         prismaMock.prototype.education = {
                                    ~~~~~~~~~
    src/tests/tests-MPC.test.ts:37:30 - error TS2540: Cannot assign to 'workExperience' because it is a read-only property.

    37         prismaMock.prototype.workExperience = {
                                    ~~~~~~~~~~~~~~
    src/tests/tests-MPC.test.ts:45:30 - error TS2540: Cannot assign to 'resume' because it is a read-only property.

    45         prismaMock.prototype.resume = {

10. Perfect, now the first test is working.
    Lets go with the next scenario: 2. Validation Failures:
    Test input validation for each field (e.g., invalid email, missing required fields like firstName or lastName).

    > Fixing some error in the same way as the previous ones but just usign the assistant to do it. In 3 iterations I had it fixed.

11. Test working, go with the next scenario: 
    3. Database Errors:
    Simulate database failures (e.g., connection errors) and ensure that the service

12. For the last test I need to handle 2 process on the create prisma mock, how can we do it and maintain all the tests working?
    ```
    // Define the candidate property on the prismaMock.prototype
        Object.defineProperty(prismaMock.prototype, 'candidate', {
            value: {
                create: jest.fn().mockResolvedValue({
                    id: 1,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com"
                }),
                create: jest.fn().mockRejectedValue(new Error('Failed to connect to the database')),
                update: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            },
            writable: true
        });
    ```

    > Fixing some error in the same way as the previous ones but just usign the assistant to do it. In 3 iterations I had it fixed.

13. Tests working. Continue creating the test for the next scenario: 
    4. Duplicate Email:
    Attempt to add a candidate with an email that already exists in the database to test the unique constraint on the email field.

    > Fixing some error in the same way as the previous ones but just usign the assistant to do it. In 3 iterations I had it fixed.

14. Last scenario
    5. Associated Data Integrity:
    Ensure that related data (educations, work experiences, resumes) is correctly linked to the candidate and stored properly.

    > Fixing some error in the same way as the previous ones but just usign the assistant to do it. In 3 iterations I had it fixed.

---

