import "./App.css";
// import firebase from "./firebase.js";
import { useEffect, useState } from "react";
import axios from "axios";

// ======== API ENDPOINTS ======= \\
/*

- Fetch food items Common and Branded
GET: https://trackapi.nutritionix.com/v2/search/instant
  params: { query: string, detailed: boolean }
  
*/

// ======== API Authentication ======== \\
const apiId = "338f3631";
const apiKey = "22d6ce3bf3f9c8d2a561f57b78ff91d8";
const requestOptions = {
  dataResponse: "json",
  headers: {
    "x-app-id": apiId,
    "x-app-key": apiKey,
  },
};

// ======== Fetch methods ======== \\
const fetchCommonAndBrandedFoods = (query, setFoodData, setLoadingState) => {
  // Clean food items and start loading
  setFoodData({ common: [], branded: [] });

  setLoadingState("pending");

  axios
    .get("https://trackapi.nutritionix.com/v2/search/instant", {
      ...requestOptions,
      params: {
        query,
        detailed: true,
      },
    })
    .then(({ data }) => {
      // Save foods item in the state
      setFoodData({
        common: data.common.map((food, index) => ({
          ...food,
          liked: false,
          tag_id: Number(food.tag_id || index) + index,
        })),

        branded: data.branded.map((food, index) => ({
          ...food,
          liked: false,
          tag_id: Number(food.tag_id || index) + index,
        })),
      });

      setLoadingState("completed");
    })
    .catch((error) => {
      console.log(error);
      setLoadingState("failed");
    });
};

const getFoodNutrients = (list) => {
  if (typeof list !== "object") return [];

  const mappedNutrients = allNutrientsData.map((item) => {
    const nutrient = list.find((el) => el.attr_id === item.attr_id);

    return {
      name: item.name,
      unit: item.unit,
      value: nutrient ? Number(nutrient.value).toFixed(0) : 0,
      attr_id: item.attr_id,
    };
  });

  const facts = mappedNutrients.slice(0, 8);

  const vitamines = mappedNutrients.slice(8, mappedNutrients.length);

  return {
    facts,
    vitamines,
  };
};

const allNutrientsData = [
  { name: "Calories", attr_id: 208, unit: "kcal" },
  { name: "Carbs", attr_id: 205, unit: "g" },
  { name: "Sodium", attr_id: 307, unit: "mg" },
  { name: "Sugar", attr_id: 269, unit: "g" },
  { name: "Protein", attr_id: 203, unit: "g" },
  { name: "Fat", attr_id: 605, unit: "g" },
  { name: "Saturated Fat", attr_id: 606, unit: "mg" },
  { name: "Fiber", attr_id: 291, unit: "g" },
  { name: "Vitamine A", attr_id: 318, unit: "IU" },
  { name: "Vitamine B-6", attr_id: 415, unit: "mg" },
  { name: "Vitamine D", attr_id: 324, unit: "IU" },
  { name: "Vitamine C", attr_id: 401, unit: "mg" },
  { name: "Vitamine E", attr_id: 323, unit: "mg" },
  { name: "Magnesium", attr_id: 304, unit: "mg" },
  { name: "Zinc", attr_id: 309, unit: "mg" },
  { name: "Iron", attr_id: 303, unit: "mg" },
];

/* ====================
      Components
===================== */

// Love Button
function LoveButton(props) {
  return (
    <button onClick={props.handleLoveButtonClick} className="love-btn">
      <i
        title="Add to compare"
        className={`${props.liked ? "fas" : "far"} fa-heart`}>
        {" "}
      </i>
    </button>
  );
}

// Filter Button
function FilterButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={`btn btn-white${props.isActive ? " is-active" : ""}`}>
      {props.label}
    </button>
  );
}

// Food Card
function FoodCard(props) {
  return (
    <article className="food-card">
      <div className="food-card-image">
        <img src={props.photo} alt={props.foodName} />
      </div>
      <div className="food-card-data">
        <div className="food-card-data-heading">
          <h3 className="food-name"> {props.foodName} </h3>
          <LoveButton
            liked={props.liked}
            handleLoveButtonClick={props.handleAddToComparisonList(props.tagId)}
          />
        </div>
        <ul className="food-extra-data">
          <li>
            <h4>
              Serving quantity: <span> {props.servingQuantity} </span>
            </h4>
          </li>
          <li>
            <h4>
              Serving weight:
              <span> {props.servingWeightGrams} gr </span>
            </h4>
          </li>
          <li>
            <h4>
              Serving unit: <span> {props.servingUnit} </span>
            </h4>
          </li>
        </ul>
      </div>
    </article>
  );
}

// Food type button
function FoodTypeButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={`btn btn-purple outlined btn-shadow${
        props.isActive ? " is-active" : ""
      }`}
      type="submit">
      {props.label}
    </button>
  );
}

// Compare Item
function CompareItem(props) {
  const nutrients = getFoodNutrients(props.food.full_nutrients);

  return (
    <div className="compare-item animate-fade-in">
      <div className="compare-item-header">
        <div className="compare-item-image">
          <img src={props.food.photo.thumb} alt={props.food.food_name} />
        </div>

        <h3>{props.food.food_name}</h3>

        <button
          onClick={props.handleRemoveFromComparison}
          className="compare-item-remove-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="compare-item-table">
        <div className="table-column nutrients-facts-table">
          <h3 className="table-title">Nutritional Facts</h3>
          {nutrients.facts.map((item) => (
            <div key={item.attr_id} className="table-row">
              <h4 className="table-row-title">{item.name}</h4>
              <span className="table-row-value">{`${item.value} ${item.unit}`}</span>
            </div>
          ))}
        </div>

        <div className="table-column vitamins-table">
          <h3 className="table-title">Vitamines and Minerals</h3>
          {nutrients.vitamines.map((item) => (
            <div key={item.attr_id} className="table-row">
              <h4 className="table-row-title">{item.name}</h4>
              <span className="table-row-value">{`${item.value} ${item.unit}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [comparisonList, setComparisonList] = useState([]);

  const [commonFoodsList, setCommonFoodsList] = useState([]);

  const [brandedFoodsList, setBrandedFoodsList] = useState([]);

  const [selectedFoodList, setSelectedFoodList] = useState([]);

  const [fetchStatus, setFetchStatus] = useState("pending");

  const [selectedType, setSelectedType] = useState("common");

  const [query, setQuery] = useState("banana");

  const [selectedFilter, setSelectedFilter] = useState({
    name: "all",
    attr_id: null,
  });

  const handleFilterClick = (filter) => {
    if (filter.name === selectedFilter.name) return;

    const filterFoodsListByNutrient = (nutrientId, list) => {
      return setSelectedFoodList(
        list.filter((food) =>
          food.full_nutrients.some(
            (nutrient) => nutrient.attr_id === nutrientId
          )
        )
      );
    };

    return () => {
      showLoadingStatus();

      setSelectedFilter(filter);

      setSelectedFoodList([]);

      if (selectedType === "common") {
        if (filter.name === "all") return setSelectedFoodList(commonFoodsList);

        return filterFoodsListByNutrient(filter.attr_id, commonFoodsList);
      }

      if (selectedType === "branded") {
        if (filter.name === "all") return setSelectedFoodList(brandedFoodsList);

        return filterFoodsListByNutrient(filter.attr_id, brandedFoodsList);
      }
    };
  };

  const handleFoodTypeClick = (type) => {
    return () => {
      if (selectedType === type) return;

      showLoadingStatus();

      setSelectedType(type);

      setSelectedFilter({ name: "all", attr_id: null });

      setSelectedFoodList([]);

      if (type === "common") return setSelectedFoodList(commonFoodsList);

      if (type === "branded") return setSelectedFoodList(brandedFoodsList);
    };
  };

  const handleLike = (itemId) => {
    return () => {
      const item = selectedFoodList.find((item) => item.tag_id === itemId);

      if (comparisonList.every((food) => food.tag_id !== itemId)) {
        updateItemLikedState(itemId, true);

        setSelectedFoodList((prev) =>
          prev.map((item) => {
            if (item.tag_id === itemId) {
              return {
                ...item,
                liked: true,
              };
            }

            return {
              ...item,
            };
          })
        );

        return setComparisonList((prev) => [...prev, { ...item, liked: true }]);
      }
    };
  };

  const handleRemoveFromComparison = (itemId) => {
    return () => {
      updateItemLikedState(itemId, false);

      setSelectedFoodList((prev) =>
        prev.map((item) => {
          if (item.tag_id === itemId) {
            return {
              ...item,
              liked: false,
            };
          }

          return {
            ...item,
          };
        })
      );

      return setComparisonList((prev) =>
        prev.filter((food) => food.tag_id !== itemId)
      );
    };
  };

  const showLoadingStatus = () => {
    setFetchStatus("loading");

    const timeOut = setTimeout(() => {
      setFetchStatus("completed");
      clearTimeout(timeOut);
    }, 500);
  };

  const setFoodsDataAfterSearch = (data = { common: [], branded: [] }) => {
    const commonList = data.common.map((item) => {
      const likedItem = comparisonList.find(
        (food) => food.tag_id === item.tag_id
      );

      if (likedItem) return likedItem;

      return item;
    });

    const brandedList = data.branded.map((item) => {
      const likedItem = comparisonList.find(
        (food) => food.tag_id === item.tag_id
      );

      if (likedItem) return likedItem;
      return item;
    });

    setCommonFoodsList(commonList);
    setBrandedFoodsList(brandedList);
    setSelectedFilter({ name: "all", attr_id: null });
    setSelectedFoodList([]);

    if (commonList.length > 0) {
      setSelectedType("common");
      setSelectedFoodList(commonList); // Detault list to show
      return;
    }

    if (brandedList.length > 0) {
      setSelectedType("branded");
      setSelectedFoodList(brandedList); // Detault list to show
      return;
    }
  };

  const handleFoodSearch = (event) => {
    event.preventDefault();

    if (query.trim().length) {
      fetchCommonAndBrandedFoods(
        query,
        setFoodsDataAfterSearch,
        setFetchStatus
      );
    }
  };

  const updateItemLikedState = (itemId, liked) => {
    const commonFood = commonFoodsList.find((food) => food.tag_id === itemId);

    if (commonFood) {
      setCommonFoodsList((prev) =>
        prev.map((food) => {
          if (food.tag_id === commonFood.tag_id) {
            return {
              ...commonFood,
              liked,
            };
          }
          return food;
        })
      );
    } else {
      const brandedFood = brandedFoodsList.find(
        (food) => food.tag_id === itemId
      );

      setBrandedFoodsList((prev) =>
        prev.map((food) => {
          if (food.tag_id === brandedFood.tag_id) {
            return {
              ...brandedFood,
              liked,
            };
          }
          return food;
        })
      );
    }
  };

  const completedWithoutResults =
    fetchStatus === "completed" && selectedFoodList.length === 0;

  const skeletonAndDisabledClassNames = `${
    fetchStatus === "failed" ? " is-disabled" : ""
  }${fetchStatus === "pending" ? " is-skeleton" : ""}`;

  // Make an API call
  useEffect(() => {
    fetchCommonAndBrandedFoods(query, setFoodsDataAfterSearch, setFetchStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1> Nutrition Navigator </h1>
      </header>

      {/* Main */}
      <main className="main wrapper">
        {/* Search */}
        <section className="search-form-section main-section">
          <h2 className="section-heading">Search</h2>
          <form onSubmit={handleFoodSearch} className="search-form">
            <label htmlFor="search">
              <input
                onChange={({ target: { value } }) => {
                  setQuery(value);
                }}
                value={query}
                placeholder="Search by name"
                type="text"
                className={`text-field${
                  fetchStatus === "pending" ? " is-disabled" : ""
                }`}
                name="search"
              />
            </label>
            <button
              className={`btn btn-purple btn-shadow btn-rounded${
                fetchStatus === "pending" ? " is-disabled" : ""
              }`}
              type="submit">
              <i className="fas icon fa-search"> </i>
            </button>
          </form>
        </section>

        <section className="main-section results-section">
          {/* Filters by nutrient */}
          <div
            className={`filters-buttons-container${skeletonAndDisabledClassNames}`}>
            <div className="food-types-buttons">
              <FoodTypeButton
                onClick={handleFoodTypeClick("common")}
                isActive={selectedType === "common"}
                label="Common"
              />

              <FoodTypeButton
                onClick={handleFoodTypeClick("branded")}
                isActive={selectedType === "branded"}
                label="Branded"
              />
            </div>

            <FilterButton
              onClick={handleFilterClick({ name: "all", attr_id: null })}
              isActive={selectedFilter.name === "all"}
              label={
                selectedFilter.name === "all"
                  ? `${"All"} (${selectedFoodList.length})`
                  : "All"
              }
            />

            {allNutrientsData.map((nutrient) => (
              <FilterButton
                key={nutrient.name}
                onClick={handleFilterClick(nutrient)}
                isActive={selectedFilter.name === nutrient.name}
                label={
                  selectedFilter.name === nutrient.name
                    ? `${nutrient.name} (${selectedFoodList.length})`
                    : nutrient.name
                }
              />
            ))}
          </div>

          {/* Results */}
          <div className="results-container">
            {/* If pending or fetching data */}
            {fetchStatus === "pending" && (
              <div className="helper-message">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}

            {/* Simulates the loading state  */}
            {fetchStatus === "loading" && (
              <div className="helper-message">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}

            {/* If failed to fetch */}
            {fetchStatus === "failed" && (
              <div className="helper-message">
                <i className="far fa-sad-tear"></i>
                <span>
                  An error has ocurred, please check yout network connection and
                  try again.
                </span>
              </div>
            )}

            {/* If completed to fetch and there is not results or data is empty */}
            {completedWithoutResults && selectedFilter.name === "all" && (
              <div className="helper-message">
                <i className="far fa-sad-tear"></i>
                <span>Sorry! We didn't find anything here.</span>
              </div>
            )}

            {/* If completed to fetch and there is results */}
            {fetchStatus === "completed" && selectedFoodList.length > 0 && (
              <div className="cards-container animate-fade-in">
                {selectedFoodList.map((foodItem, index) => (
                  <FoodCard
                    handleAddToComparisonList={handleLike}
                    foodName={foodItem.food_name}
                    key={index}
                    liked={foodItem.liked}
                    tagId={foodItem.tag_id}
                    photo={foodItem.photo.thumb}
                    servingQuantity={foodItem.serving_qty}
                    servingUnit={foodItem.serving_unit}
                    servingWeightGrams={foodItem.serving_weight_grams}
                  />
                ))}
              </div>
            )}

            {/* If a filter is clicked and there is not matched results with filters */}
            {completedWithoutResults && selectedFilter.name !== "all" && (
              <div className="helper-message">
                <i className="far fa-frown-open"></i>
                <span>There is not foods with this nutrient.</span>
              </div>
            )}
          </div>
        </section>

        {/* Compare Foods section */}
        <section className="compare-foods">
          <h2 className="section-heading">Compare Foods</h2>

          <div className="compare-foods-container">
            {comparisonList.length === 0 && (
              <div className="helper-message">
                <span>
                  Click the <i className={`fas fa-heart`}> </i> to compare the
                  foods here
                </span>
              </div>
            )}
            {comparisonList.map((food, index) => (
              <CompareItem
                handleRemoveFromComparison={handleRemoveFromComparison(
                  food.tag_id
                )}
                food={food}
                key={index}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by
          <a href="http://www.nutritionix.com/api"> Nutritionix API </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
