const issueTitle = "This is an issue of type: Task.";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        openIssue(issueTitle);
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should create, edit and delete a comment successfully", () => {
    const fieldAddaComment = "Add a comment...";
    const comment = "Sigrid adds a comment";
    const getAreaForComment = () =>
      cy.get('textarea[placeholder="Add a comment..."]');
    const getIssueComment = () => cy.get('[data-testid="issue-comment"]');
    const editedComment = "Sigrid edits a comment";
    const expectedAmountOfCommentsAfterAddAndEdit = 2;
    const expectedAmountOfCommentsAfterDeletion = 1;

    getIssueDetailsModal().within(() => {
      cy.contains(fieldAddaComment)
        .scrollIntoView()
        .should("be.visible")
        .click();

      //Assert that Save and Cancel button are visible
      saveButtonIsVisible();
      cancelButtonIsVisible();
      //Add a comment
      getAreaForComment().type(comment);
      cy.contains("button", "Save").click().should("not.exist");

      cy.contains(fieldAddaComment).should("exist");
      getIssueComment().should(
        "have.length",
        expectedAmountOfCommentsAfterAddAndEdit
      );
      getIssueComment().should("contain", comment);

      //Assert that Edit button is visible
      getIssueComment()
        .first()
        .contains("Edit")
        .should("be.visible")
        .click()
        .should("not.exist");

      //Edit comment
      getAreaForComment()
        .should("contain", comment)
        .clear()
        .type(editedComment);

      //Assert that Save and Cancel button are visible
      saveButtonIsVisible();
      cancelButtonIsVisible();

      cy.contains("button", "Save").click().should("not.exist");

      getIssueComment().should(
        "have.length",
        expectedAmountOfCommentsAfterAddAndEdit
      );
      getIssueComment().should("contain", editedComment);

      // Delete comment
      getIssueComment().first().contains("Delete").should("be.visible").click();
    });

    //Assertions in the deletion confirmation dialogue
    cy.get('[data-testid="modal:confirm"]').should("exist");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Are you sure you want to delete this comment?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cancelButtonIsVisible();
      cy.contains("button", "Delete comment").click().should("not.exist");
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    //Assert that comment is deleted
    getIssueDetailsModal().within(() => {
      getIssueComment().should(
        "have.length",
        expectedAmountOfCommentsAfterDeletion
      );
    });
  });

  function openIssue(issueTitle) {
    cy.contains(issueTitle).click();
  }

  function saveButtonIsVisible() {
    cy.contains("button", "Save").should("be.visible");
  }

  function cancelButtonIsVisible() {
    cy.contains("button", "Cancel").should("be.visible");
  }
});
