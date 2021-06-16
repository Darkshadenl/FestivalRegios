// enable_disable_queues.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


describe('enable_disable_queues', () => {
    before(function() {
        cy.visit('http://localhost:8080/')
        cy.get('[data-cy=startSim]').click()
    })

    describe('enable_queue_1', () => {
        cy.get('#action-canvas')
            .click(315, 30)
    })

    describe('enable_queue_2', () => {
        cy.get('#action-canvas')
            .click(315, 83)
    })

    describe('enable_queue_3', () => {
        cy.get('#action-canvas')
            .click(315, 127)
    })

    describe('enable_queue_4', () => {
        cy.get('#action-canvas')
            .click(315, 174)
    })


    describe('disable_queue_1', () => {
        cy.get('#action-canvas')
            .click(315, 30)
    })

    describe('disable_queue_2', () => {
        cy.get('#action-canvas')
            .click(315, 83)
    })

    describe('disable_queue_3', () => {
        cy.get('#action-canvas')
            .click(315, 127)
    })

    describe('disable_queue_4', () => {
        cy.get('#action-canvas')
            .click(315, 174)
    })
}