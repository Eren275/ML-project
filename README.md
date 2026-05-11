# ML-project
Ahmed -> Prepocessing,  Trained and predicted Decission Tree and Random Forest Regressors




ROMEO -> 
This project predicts English Premier League match outcomes using Machine Learning (Logistic Regression).
 Key Changes Made
Removed data leakage features (FullTimeGoals, HalfTimeResults)
Cleaned and sorted data by MatchDate
Converted team names into numerical features
Fixed feature engineering (attack & defense strength)
Added Goal Difference proxy feature
Used time-based train/test split instead of random split
Balanced classes using class_weight='balanced'
 Model Improvement Stages
Initial model: ~58% accuracy (biased predictions)
After cleaning: ~54% accuracy (more realistic results)
Final stable model: ~61% accuracy (best balance)
 Final Model
Logistic Regression (multiclass)
Outputs probabilities for:
Home Win
Draw
Away Win
Romeo DONE


#ibrahim hafez-->
1. Data Loading

The dataset was loaded from an Excel file and a safe copy was created to preserve the original data.

2. Preprocessing
Converted match dates to datetime format
Sorted data chronologically
Encoded match results into numeric values
3. Feature Engineering

Created football-specific features to improve prediction:

Elo Rating System to measure team strength dynamically
Form Features based on last 5 matches performance
Additional metrics like shot difference, shot balance, and draw risk
4. Encoding

Applied one-hot encoding to categorical features (HomeTeam, AwayTeam).

5. Train-Test Split

Used a time-based split (80%training,20%testing) to simulate real-world prediction.

6. Model

Built a machine learning pipeline using:

StandardScaler
Support Vector Machine (SVM) with RBF kernel
Balanced class weights
7. Training & Evaluation
Model trained on historical data
Evaluated using accuracy, classification report, and confusion matrix
Confusion matrix visualized
8. Model Saving

Final trained model was saved as a .pkl file for reuse.

ibrahim hafez done #

Ahmed and Romeo-> 
# Multi-Model EPL Match Predictor

## What It Does
Trains 7 models on EPL match statistics to predict Full Time Result (H/D/A), compares them in one table, then combines them into a Voting Ensemble.

## Features Used (17 total)
Raw: HomeShots, AwayShots, HomeShotsOnTarget, AwayShotsOnTarget, HomeCorners, AwayCorners, HomeFouls, AwayFouls, HomeYellowCards, AwayYellowCards, HomeRedCards, AwayRedCards
Engineered: ShotDiff, ShotOnTargetDiff, CornerDiff, FoulDiff, YellowDiff

## Models & Results

| Model               | Train  | Test   | CV-5   | Gap    |
|---------------------|--------|--------|--------|--------|
| Logistic Regression | 54.29% | 55.33% | 52.81% | -1.04% |
| Random Forest       | 57.41% | 52.24% | 50.15% |  5.17% |
| Gradient Boosting   | 59.90% | 60.18% | 55.82% | -0.28% |
| XGBoost             | 61.99% | 59.38% | 55.64% |  2.61% |
| SVM                 | 55.62% | 56.29% | 52.96% | -0.67% |
| Decision Tree       | 52.43% | 50.48% | 46.50% |  1.95% |
| CatBoost            | 56.24% | 57.57% | 53.64% | -1.33% |
| Voting Ensemble     | 60.02% | 59.38% |   —    |  0.64% |

Best model: Gradient Boosting — 60.18% test accuracy
