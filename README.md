## Background
This application was designed in response to a TAG (Technology Association of Georgia) Mobility Hackathon event in which teams were asked to create mobile applications based on the needs of a handful of non-profit organizations. The organization targeted for this application is the National 4-H Council. 

## Project Request
Below is taken verbatim from the original 4-H project description.
> Project #1 - Curriculum App - The eCommerce team would like to build on this expanding reach by entering the digital space with our curriculum in a way that is useful to our customers. We want to create an app that supplements the national 4-H Entomology curriculum titled Teaming with Insects, and will allow youth to engage with this material in a way that they are already very comfortable with - mobile technology. If this initial mobile application is successful and reviewed positively by our customers, we'd like to expand upon this strategy in the future with additional curriculum topic areas. In line with 4-H's philosophy of starting with the problem rather than the solution, we are eager to have the teams determine what this app should look and feel like. We will not be prescriptive in our requirements. That being said, we will outline the necessary features and outcomes to give guidance. Click Here to view the Project Template. 


## Hack Team 
Russell Endicott and Chris Evett. Backgrounds in Scripting/Sysadmin and Development/Entomology respectively.

## Scope and Justification
After speaking with a few of the Entomology contributors within 4-H and their Purdue colleagues it was indicated that insect identification was one of the big challenges for young kids trying to get into the field. We also found there to be an absence of existing identification tools geared towards younger audiences that were mobile friendly. We decided to take a new approach to an old Entomology tool--the Dichotomous Key. 

>"A dichotomous key is a tool that allows the user to determine the identity of items in the natural world, such as trees, wildflowers, mammals, reptiles, rocks, and fish. Keys consist of a series of choices that lead the user to the correct name of a given item. "Dichotomous" means "divided into two parts". Therefore, dichotomous keys always give two choices in each step. "
--http://oregonstate.edu/trees/dichotomous_key.html

If executed properly the entomological dichotomous key would be something that could be helpful to entomologists of all ages. In order to bring in younger audiences it would be ideal if we could work in things like 'gamification' and expand on some of the lesser known terminology that seasoned entomologists take for granted.

## Technical Approach
Due to the relative simplicity of the application and the fact that it needs to work on several different mobile formats we took the approach of using HTML5 and JavaScript to first write a web application that could easily be ported over to multiple architectures. 

The stack we used is as follows:
* HTML5 Canvas
* JavaScript
* JCanvas library (easier Canvas interaction)
* JQuery

The HTML simply contains a definition for a canvas element in which the JavaScript will generate content. The JavaScript draws all of the visual elements and provides all of the event handlers. The true Dichotomous Key data is derived from two flat files which contain structured JSON. 

The JavaScript starts off by drawing a 'couplet' card from the first element in the JSON which pulls in the associated images as needed. When the 'next' button is clicked for option one or option two of the couplet card, the JavaScript looks in the JSON for the child element and then draws the next couplet card. 

