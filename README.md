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

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── README.md  
├── backend-project
│   ├── README.md
│   ├── setup.py   # main app
│   ├── pyproject.toml
│   ├── src
│   │   ├── dummy_server
│   │   │     ├── router
│   │   │     │    ├── routes.py
│   │   │     │    ├── app.py
│   │   │     │    └── __init__.py
│   │   │     └── resources
│   │   │         ├── scatter_data.py
│   │   │         └── __init__.py
│   │   └── __init__.py 
│   ├── data
│   │   ├── dataset_blobs.csv
│   │   ├── dataset_circles.csv
│   │   ├── dataset_moons.csv
│   │   └── generate_data.py    # script to create data
│   └── MANIFEST.in
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── router
│   │   │   ├── resources
│   │   │   │   └── data.ts
│   │   │   └── apiClient.ts
│   │   ├── components
│   │   │   ├── utils.ts
│   │   │   ├── ScatterPlot.tsx
│   │   │   ├── DataChoice.tsx
│   │   │   └── ScatterPlot.css
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── margin.ts
│   │       └── data.ts
│   ├── tsconfig.json
│   └── public
│        ├── robot.txt
│        ├── manifest.json
│        ├── logo512.png
│        ├── logo192.png
│        ├── index.html
│        └── favicon.ico
└── Dockerfile
```

## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the dummy project you have to:
- clone the repository;
- open a new terminal instance;
- move to the folder where the project has been downloaded using the command ```cd```;
- open the folder called "dummy-fullstack-main";
To run the backend
- open the backend folder called "backend-project";
- create a virtual environment using the command ```conda create -n nameOfTheEnvironment```;
- activate the virtual environment run the command ```conda activate nameOfTheEnvironment```;
- install the requirements from the txt file using the command ```pip3 install -r requirements.txt```;
- start the backend with the command ```python3 setup.py run```;
To run the frontend
- open a new terminal instance and once again go to the folder called "dummy-fullstack-main"
- open the frontend folder called "react-frontend";
- start the front end by using the following two commands ```npm install```, ```npm start```;
If all the steps have been successfully executed a new browser window will open automatically.

## Backend-Specifications

- scatterdata/
  - GET
    - Returns: A list of all people, with information about the fairness of their decision. Bias is some number describing the predicted bias for that person,
    qualification some number describing the predicted actual qualification and
    id the ID of the person.
    - Exact format:
        ```json
        {"scatterdata": [{"bias", "qualification", "id"}]}
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
    call to person/{`id`}
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
      {"groups": [{"group", "score"}], "overallscore"}
      ```
    - Justification of existence: We want to show fairness per group and total fairness. This is a very complex task and depends on our ML model (just like scatterdata), so we definitively want to do this in the backend.

## Frontend: Visual Encoding
<details><summary>MainPage</summary>
<img src="/images/VisualEncodingMain.png" alt= "MainPage" width=750 height=500>
</details>
<details><summary>PopUp</summary>
<img src="/images/VisualEncodingPopUp.png" alt= "PopUp" width=500 height=300>
</details>




#### 1. ScatterPlot
  - point: person (onClick -> open Person Pop-up)
  - x-axis: bias attribute.
  - y-axis: qualification attribute.
  - color: red: rejected, green: accepted
  - RadioButton/Checkbox/DropdownButton to select attribute for each axis.
  
#### 2. Person Pop-up
  - All informations about this person.
  - An "Ignore" button to to mark the influence of this person as zero.
  - A list of one/multiple similar people to which the user can compare the person and the respective decission to. 
#### 3. Reconsider-list
  - List of 10 people 
  - onClick -> open Person Pop-up 
#### 4. Fairness score
  - BarPlot of influence of biased/unfair attributes to the hiring decission.

## Milestones
Document here the major milestones of your code and future planned steps.\
- [x] Week 1
  - [x] Completed Sub-task: [#20984ec2](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/commit/20984ec2197fa8dcdc50f19723e5aa234b9588a3)
  - [x] Completed Sub-task: ...

- [ ] Week 2
  - [ ] Sub-task: [#2](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/issues/2)
  - [ ] Sub-task: ...

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/tags/stable-readme)
- Week 2: ..
- Week 3: ..
- ...


