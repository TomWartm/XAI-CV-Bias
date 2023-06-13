# CV Bias Assessment

[[_TOC_]]

## Team Members
1. Vito Pagone
2. Simon Perisanidis
3. Tom Wartmann
4. Jannis Widmer

## Project Description 
We all have some amount of unconcious bias, whether that's towards someone's race, gender, age, sexual orientation or even education, socioeconomic backround etc. That's not always bad, but it can be deleterious when these shortcuts are used by desicion-makers such as recruiters.
Our goal is to create an interactive tool that assists recruiters in identifying and overcome their biases. The focus of the proposed project is the interactivity of the user interface.


### Users
- Recruiters
- HR Managers/Leads

### Datasets
Utrecht fairness recruitment (synthetic)
Link: [https://www.kaggle.com/datasets/ictinstitute/utrecht-fairness-recruitment-dataset](url)

See the folder Data-Analysis for exploration.

### Tasks
Define all the tasks you want your dashboard solve.



## Requirements
- conda
- python

## How to Run

To run our project you have to:
- clone this repository;
- open a new terminal instance;
- move to the folder where the project has been downloaded using the command ```cd```;

- open the folder called "c3-cv-bias-assessment";

To run the backend:
- open the backend folder called "backend-project";
- create a virtual environment using the command ```conda create -n nameOfTheEnvironment```;
- activate the virtual environment run the command ```conda activate nameOfTheEnvironment```;
- install the requirements using the command ```pip install . --user```;
- start the backend with the command ``` python \src\dummy_server\router\app.py``` ;

To run the frontend:
- open a new terminal instance and once again go to the folder called "c3-cv-bias-assessment"
- open the frontend folder called "react-frontend";
- start the front end by using the following two commands ```npm install```, ```npm start```;
If all the steps have been successfully executed a new browser window will open automatically.

## Backend-Specifications

- scatterdata/
  - GET
    - Returns: A list of all people, with information about the fairness of their decision. Bias is some number describing the predicted bias for that person,
    qualification some number describing the predicted actual qualification and
    id the ID of the person. "decision" is an boolean describing if the person got accepted or rejected by the company.
    - Exact format:
        ```json
        {"scatterdata": [{"bias", "qualification", "id", "decision"}]}
        ```
    - Justification of existence: We need some way to get the predicted aggregated values
    for each person as it is required to draw our scatter plot relating indiviuals to "fair" qualifications and unfair biases, which played a role in the decision. Already in our case and especially with an actually suited model this will be complex, so it should be done in the backend.
- person/{`id`}/
  - GET
    - Returns: All data about the person with ID `id`. This is basically simply a row
    of the dataset.
    - Justification of existence: We want to show detailed person information when user clicks 
    on entries.
  - POST
    - A post to a person will mark the influence of bias for this person as zero. Since we don't have different actions related to people, it's fine to always do this as reaction to a POST.
    - Justification of existence: We would like to give the user the option to state that
    a decision was not biased. This will change the output of nearly all other endpoints,
    so therefore it has to be a POST. (side-effects)
- similarpeople/{`id`}/{`amount`}
  - GET
    - Returns: A list of `amount` people
    which are the most similar to the person defined by `id` based on fair qualifications (not on bias). The contained information per person are exactly the same as you would get by a 
    call to person/{`id`}. The first row is the data for the person with `id` itself.
    - Justification of existence: We would like to show similar people if user clicks on a person in the scatter-plot. This is a rather complex task for which we have to look at
    the whole dataset, so this should clearly be on the server.
- reconsider/
  - GET
    - Returns: A list of people for which bias played an important role in the decision. The
    content per person is the same as a call to person/{`id`} would return.
    - Justification of existence: We want to have a dashboard showing people that should be reconsidered. One could probably figure this out from scatterdata, but it's already non trivial, so it makes more sense to do it in the backend.
- fairness/
  - GET
    - Returns: Some rating of how biased the decisions are. Groups is a list of attributes on which people might be biased (e.g. gender) and score is some measure of how strongly biased the decisions where with respect to that attribute.
    Overallscore is some total fairness score that we compute over all groups.
    - Exact format:
      ```json
      {"groups": [{"label": "group","value": "score"}], "overallscore"}
      ```
    - Justification of existence: We want to show fairness per group and total fairness. This is a very complex task and depends on our ML model (just like scatterdata), so we definitively want to do this in the backend.

## Frontend: Visual Encoding
<details><summary>MainPage</summary>
<img src="/images/VisualEncodingMain2.png" alt= "MainPage" width=750 height=500>
</details>
<details><summary>PopUp</summary>
<img src="/images/VisualEncodingPopUp.png" alt= "PopUp" width=500 height=300>
</details>




#### 1. ScatterPlot
  - point: person (onClick -> open Person Pop-up)
  - x-axis: bias attribute.
  - y-axis: qualification attribute.
  - color: red: rejected, green: accepted
  - Yellow question marks: display infos onClick how the bias/qualification attribute was computed.
  
#### 2. Person Pop-up
  - All informations about this person.
  - An "Ignore" button to to mark the influence of this person as zero.
  - A list of one/multiple similar people to which the user can compare the person and the respective decission to. 
#### 3. Reconsider-list
  - List of 10 people 
  - onClick -> open Person Pop-up 
#### 4. Fairness score
  - BarPlot of influence of biased/unfair attributes to the hiring decission.



## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/tags/stable-readme)
- Milestone 3: [Tag](https://gitlab.inf.ethz.ch/course-xai-iml23/c3-cv-bias-assessment/-/tags/milestone3)



