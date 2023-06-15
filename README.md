# CV Bias Assessment

[[_TOC_]]

## Team Members
1. Vito Pagone
2. Simon Perisanidis
3. Tom Wartmann
4. Jannis Widmer

## Contribution
We all had a contribution in the project. We decided on how to design the tool together, then we defined tasks and divided them fairly among the team members. There where soft trends in task assignment: Vito Pagone was mostly working on the machine learning parts, Simon Perisanidis and Tom Wartmann were mostly working on the frontend, and Jannis Widmer mainly worked on the backend.

## Project Description 
We all have some amount of unconcious bias, whether that's towards someone's race, gender, age, sexual orientation or even education, socioeconomic backround etc. That's not always bad, but it can be deleterious when these shortcuts are used by desicion-makers such as recruiters.
Our goal is to create an interactive tool that assists recruiters in identifying and overcome their biases. The focus of the proposed project is the interactivity of the user interface.

Find the deployed version at [CV Bias Assessment](http://c3-cv-bias-assessment.course-xai-iml23.isginf.ch/dashboard/app).


### Users
- Recruiters
- HR Managers/Leads

### Datasets
Utrecht fairness recruitment (synthetic)
Link: [https://www.kaggle.com/datasets/ictinstitute/utrecht-fairness-recruitment-dataset](url)

See the folder Data-Analysis for exploration.

### Tasks
Allow users to view their past decisions and search for biases in them in a guided fashion. 
Review decisions for the people affected most by bias.
Figure out which criterias mattered most in the decision and if this should be the case.

## Requirements
- conda
- python 3

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





## Versioning

Tags:
- Final Version: [Tag](https://gitlab.inf.ethz.ch/course-xai-iml23/c3-cv-bias-assessment/-/tags/final-submission)


