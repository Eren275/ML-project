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