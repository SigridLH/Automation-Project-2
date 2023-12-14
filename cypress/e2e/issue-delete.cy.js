describe('Issue deletion functionality', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        //Open the first issue from the board
        openIssue('This is an issue of type: Task.');
        //Assert the visibility of the issue detail view modal
        cy.get('[data-testid="modal:issue-details"]').should('exist')
      });
    });

    it('Issue Deletion', () => {
        //Delete the issue by clicking the delete button and confirming the deletion.
        cy.get('[data-testid="icon:trash"]').click()
        cy.contains('Delete issue').click()

        //Assert that the deletion confirmation dialogue is not visible.
        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        //Assert that the issue is deleted and no longer displayed on the Jira board.
        cy.reload()
        cy.contains('This is an issue of type: Task.').should('not.exist')
    })

    it('Issue Deletion Cancellation', () => {

        //Click the Delete Issue button and then Cancel the deletion in the confirmation pop-up.
        cy.get('[data-testid="icon:trash"]').click()
        cy.contains('Cancel').click()

        //Assert that the deletion confirmation dialogue is not visible.
        cy.get('[data-testid="modal:confirm"]').should('not.exist')
        cy.get('[data-testid="modal:issue-details"]').should('exist')
        cy.get('[data-testid="icon-close"]').eq(0).click()

        //Assert that the issue is NOT deleted and is still displayed on the Jira board.
        cy.reload()
        cy.contains('This is an issue of type: Task.').should('exist')

    })

function openIssue(titleName) {
  cy.contains(titleName).click()
}

})