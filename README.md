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
