describe("smoke tests", () => {
  it("should load home page with links", () => {
    cy.visit("/");

    cy.get(".mantine-Title-root > a")
      .contains("M.RGB")
      .should("have.attr", "href", "/");
    cy.get(".mantine-Title-root>a")
      .contains("posts")
      .should("have.attr", "href", "/posts");
    cy.get(".mantine-Title-root>a")
      .contains("categories")
      .should("have.attr", "href", "/categories");

    cy.contains("Ram Gopal");
  });

  it("should load posts with articles", () => {
    cy.visit("/posts");

    cy.get(".nav-posts > a").contains("posts");
    cy.get(".nav-posts").should("have.css", "color", "rgb(33, 150, 243)");
    cy.get(".nav-posts").should(
      "have.css",
      "border-bottom",
      "1px solid rgb(33, 150, 243)"
    );

    cy.get(".mantine-List-root > li")
      .should(($lis) => {
        expect($lis).to.have.length(2);
      })
      .get(".mantine-List-root .mantine-Text-root")
      .should(($txt) => {
        expect($txt).to.have.length(4);
      });

    cy.contains("Blog Posts");
  });
});
