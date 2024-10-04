from flask import Flask, request, jsonify, send_from_directory, render_template
import joblib
import numpy as np
import pandas as pd
import traceback
import json
import os
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

# Initialize Flask app
app = Flask(__name__)

def predict_category_sales(category_name, selected_month, n_months, exog_data=None):
    # Load the saved models and dataset from the pickle file
    with open('artifacts/model_parameters.pkl', 'rb') as file:
        loaded_models = joblib.load(file)
    
    # Check if the model for the given category exists
    if category_name not in loaded_models:
        return {"error": f"No model found for category '{category_name}'."}
    
    # Get the model data
    model_data = loaded_models[category_name]
    sarima_model = model_data['sarima_model']
    sarimax_model = model_data['sarimax_model']
    
    # Load the original dataset to get the last date
    df = pd.read_csv('artifacts/updated_kalimati_tarkari_dataset_modified.csv')
    # Convert 'Date' column back to datetime to keep consistency
    df['Date'] = pd.to_datetime(df['Date'])

    # Use the previously saved 'Month_Year' column (already adjusted by 3 years)
    df['Month_Year'] = (df['Date'] + pd.DateOffset(years=3,months=4)).dt.to_period('M')

    # Find and drop rows where 'Month_Year' is the maximum value
    max_month_year = df['Month_Year'].max()
    df = df.drop(df[df['Month_Year'] == max_month_year].index)

    # Get the new maximum 'Month_Year' after removing the rows
    last_date = df['Month_Year'].max()

    # Convert user-provided month (YYYY-MM) to datetime
    try:
        selected_period = pd.Period(selected_month, freq='M')
    except ValueError:
        return {"error": f"Invalid month format. Use YYYY-MM."}
    
    # Check if the requested month is within historical data
    if selected_period <= last_date:
        filtered_data = df[(df['Month_Year'] == selected_period) & (df['Category'] == category_name)]
        if filtered_data.empty:
            return {"error": f"No sales data available for {category_name} in {selected_period}."}
        
        # Return historical sales value
        sales_value = filtered_data['Monthly_Sale'].values[0]
        return {"sales_value": sales_value}
    
    # If the selected month is in the future, predict sales
    future_dates = pd.period_range(start=last_date + 1, periods=n_months, freq='M')
    
    if exog_data is not None:
        # Ensure that the length of exog_data matches the number of months to predict
        if len(exog_data) != n_months:
            return {"error": f"Length of exogenous data ({len(exog_data)}) does not match the number of months to predict ({n_months})."}
        
        # Predict using SARIMAX model with exogenous data
        future_forecast = sarimax_model.get_forecast(steps=n_months, exog=np.array(exog_data).reshape(-1, 1))
    else:
        # Predict using SARIMA model (without exogenous data)
        future_forecast = sarima_model.get_forecast(steps=n_months)
    
    # Get predicted values
    forecast_series = future_forecast.predicted_mean
    forecast_series.index = pd.period_range(start=future_dates[0], periods=n_months, freq='M')
    forecast_series = forecast_series.apply(lambda x: round(x / 10) * 10)
    # Check if the requested month is within the predicted range
    if selected_period not in forecast_series.index:
        return {"error": f"Specified month {selected_period} is out of prediction range. The available range is from {future_dates[0]} to {future_dates[-1]}."}
    
    return {"predictions": forecast_series.loc[selected_period].tolist()}


@app.route('/predict', methods=['GET', 'POST'])
def get_prediction():
    try:
        if request.method == 'POST':
            data = request.json
            category = data.get('category')
            month = data.get('month')
            exog_data = data.get('exog_data')  # Optional exogenous data
        elif request.method == 'GET':
            category = request.args.get('category')
            month = request.args.get('month')
            exog_data = None  # Since exog_data can't be passed easily in a GET request
        
        if not category or not month:
            return jsonify({'error': 'Category and month are required.'}), 400

        # Predict
        prediction_result = predict_category_sales(category, month, n_months=12, exog_data=exog_data)

        if 'error' in prediction_result:
            return jsonify({'error': prediction_result['error']}), 400

        if 'sales_value' in prediction_result:
            return jsonify({'sales_value': prediction_result['sales_value']})  # Return historical data
        
        return jsonify({'predictions': prediction_result['predictions']})  # Return future predictions
    
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error. Please check the server logs.'}), 500


ARTIFACTS_DIR = 'artifacts'
# Load class dictionary
def load_class_dict():
    class_dict_path = os.path.join(ARTIFACTS_DIR, 'class_dictionary.json')
    try:
        with open(class_dict_path, 'r') as f:
            class_dict = json.load(f)
        return class_dict
    except FileNotFoundError:
        return {}

@app.route('/categories', methods=['GET'])
def get_categories():
    class_dict = load_class_dict()
    categories = list(class_dict.keys())
    return {'categories': categories}

@app.route('/')
def index():
    return "Welcome to the Sales Prediction API!"


# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    return "GET request successful!"

if __name__ == "__main__":
    app.run(debug=True)
