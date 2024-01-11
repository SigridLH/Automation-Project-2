describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  //TASK 1 (Sprint#2 BONUS assignment)

  it("Should have five elements in issue priorities", () => {
    const expectedLength = 5;
    let priorityArray = [];

    getIssueDetailsModal().within(() => {
      let selectedPriority = getSelectedPriority();
      priorityArray.push(selectedPriority);

      cy.log(
        `Added value: ${selectedPriority}, Array length: ${priorityArray.length}`
      );

      // Access all priorities from the dropdown

      for (let i = 0; i < 4; i++) {
        getPriorityFromDropdown(i).then((text) => {
          let priorityOption = text;
          cy.log(priorityOption);
          priorityArray.push(priorityOption);
          cy.log(
            `Added value: ${priorityOption}, Array length: ${priorityArray.length}`
          );
        });
      }
      cy.wrap(priorityArray).should("have.length", expectedLength);
    });
  });

  //TASK 2 (Sprint#2 BONUS assignment)

  it("Reporter's name should have only characters in it", () => {
    getIssueDetailsModal().within(() => {
      const getReporterNameText = cy
        .get('[data-testid="select:reporter"]')
        .invoke("text");
      const regex = /^[A-Za-z\s]+$/;

      getReporterNameText.should("match", regex);
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  function getSelectedPriority() {
    return "High";
  }

  function getPriorityFromDropdown(i) {
    return cy
      .get('[data-testid="select:priority"]')
      .click()
      .get('[placeholder="Search"]')
      .next()
      .children()
      .eq(i)
      .invoke("text");
  }
});
