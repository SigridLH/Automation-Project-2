const issueTitle = "TESTING TIME TRACKER";

describe("Issue time estimation and time logging functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        createAndOpenIssue(issueTitle);
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getInputNumberHours = () => cy.get('input[placeholder="Number"]');
  const getTimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');

  it("User should add, update and remove time estimation successfully", () => {
    //Add estimation
    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("be.visible");
      getInputNumberHours().should("exist").click().type("10");
      closeIssueDetailsModal();
    });

    //Asserting that the estimation is added and visible.
    openFirstIssueFromList();
    getIssueDetailsModal().within(() => {
      getInputNumberHours().should("have.value", "10");
      cy.contains("10h estimated").should("be.visible");

      //Update estimation
      getInputNumberHours().click().clear().type("20");
      closeIssueDetailsModal();
    });

    //Asserting that the updated value is visible.
    openFirstIssueFromList();
    getIssueDetailsModal().within(() => {
      getInputNumberHours().should("have.value", "20");
      cy.contains("20h estimated").should("be.visible");

      //Remove estimation
      getInputNumberHours().click().clear();
      closeIssueDetailsModal();
    });

    //Asserting that the value is removed.
    openFirstIssueFromList();
    getIssueDetailsModal().within(() => {
      getInputNumberHours().should("have.value", "");
      cy.contains("No time logged").should("be.visible");
    });
  });

  it("User should log and remove logged time successfully", () => {
    //Log time
    getIssueDetailsModal().within(() => {
      getInputNumberHours().click().type("10");
      cy.get('[data-testid="icon:stopwatch"]').click();
    });
    getTimeTrackingModal()
      .should("exist")
      .within(() => {
        cy.contains("No time logged").should("be.visible");
        cy.contains("Time spent (hours)").should("be.visible");
        cy.contains("Time remaining (hours)").should("be.visible");

        getInputNumberHours().eq(0).click().type("2");
        getInputNumberHours().eq(1).click().type("5");

        //Asserting that the time is logged on Time tracking modal.
        logTimeAssertLoggedAndRemainingTime();

        cy.contains("Done").click();
      });
    getTimeTrackingModal().should("not.exist");

    //Asserting that the time is logged on Issue Details modal.
    getIssueDetailsModal().within(() => {
      logTimeAssertLoggedAndRemainingTime();

      //Remove logged time
      cy.get('[data-testid="icon:stopwatch"]').click();
    });

    getTimeTrackingModal()
      .should("exist")
      .within(() => {
        getInputNumberHours().eq(0).click().clear();
        getInputNumberHours().eq(1).click().clear();

        //Asserting that the logged time is removed on Time tracking modal.
        removeLoggedTimeAssertLoggedAndRemainingTime();

        cy.contains("Done").click();
      });
    getTimeTrackingModal().should("not.exist");

    //Asserting that the logged time is removed on Issue Details modal.
    getIssueDetailsModal().within(() => {
      removeLoggedTimeAssertLoggedAndRemainingTime();
    });
  });

  //FUNCTIONS:

  function createAndOpenIssue(issueTitle) {
    cy.get('[data-testid="icon:plus"]').click();
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('input[name="title"]').type(issueTitle);
      cy.get('input[name="title"]').should("have.value", issueTitle);
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.reload();

    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains(issueTitle);
      });
    cy.contains(issueTitle).click();
  }

  function closeIssueDetailsModal() {
    cy.get('[data-testid="icon:close"]').eq(0).click();
  }

  function openFirstIssueFromList() {
    cy.get('[data-testid="list-issue"]').first().click();
  }

  function logTimeAssertLoggedAndRemainingTime() {
    cy.contains("2h logged").should("be.visible");
    cy.contains("5h remaining").should("be.visible");
    cy.contains("No time logged").should("not.exist");
    cy.contains("10h estimated").should("not.exist");
  }

  function removeLoggedTimeAssertLoggedAndRemainingTime() {
    cy.contains("2h logged").should("not.exist");
    cy.contains("5h remaining").should("not.exist");
    cy.contains("No time logged").should("be.visible");
    cy.contains("10h estimated").should("be.visible");
  }
});
