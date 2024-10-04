/*1.Thinking in React:-
                       1.React helps you think of your app as a collection of building blocks called components
                       2.When you build a ui with React, you will first break it apart into pieces called components. 
                       3.Then, you will describe the different visual states for each of your components. 
                       4.Finally, you will connect your components together so that the data flows through them.

*/



/*2.Example:-Building a searchable product data table with React:- 
                       ->In React, building a UI starts by breaking the interface into components, which are like the building blocks of your app
                       ->In example,The goal is to display a list of products that users can search and filter and Imagine that you already have a JSON API and a mockup from a designer.
*/



/*3.To implement a UI in React, you will usually follow the same five steps:-

//step1:-Breaking UI into component hierarchy:-
                        ->Start by looking at the design given of searchable product data table and determine which pieces of the UI should be separate components.
                        ->Components:-
                                      1.FilterableProductTable contains the entire app.
                                      2.SearchBar receives the user input.
                                      3.ProductTable displays and filters the list according to the user input.
                                      4.ProductCategoryRow displays a heading for each category.
                                      5.ProductRow displays a row for each product.
                        ->Component hierarchy goes like this:-
                                          
    FilterableProductTable
        SearchBar
        ProductTable
            ProductCategoryRow
            ProductRow



//step2:-Step 2: Build a static version in React:-
                          ->Now we have component hierarchy, it’s time to implement your app. 
                          ->The most straightforward approach is to build a version that renders the UI from your data model without adding any interactivity
                          ->It’s often easier to build the static version first and add interactivity later.
                          ->To build a static version of your app that represents the data, you’ll want to build components that reuse other components and pass data using props. 
*/

/*Step 3: Find the minimal but complete representation of UI state:-
                                                            ->To make the UI interactive by determining what data needs to be stored as state in the application
                                                            ->to add interactivity,we need state
                                                            ->Now,check what will be props and state
                                                                            
    1.The original list of products is passed in as props, so it’s not state.
    2.The search text seems to be state since it changes over time
    3.The value of the checkbox seems to be state since it changes over time and can’t be computed from anything.
    4.The filtered list of products isn’t state because it can be computed
*/


/*Step 4: Identify where your state should live:-
                                                  ->We identified that the state for the search text and checkbox value should live in the FilterableProductTable component 
                                                  ->why because it’s the common parent of both ProductTable and SearchBar.
                                                  -> Now, we will add the necessary state to allow user interaction and pass that state down to the child components via props.
*/

/*step5: Adding Inverse Data flow:-
                                    ->Tochange the state according to user input, you will need to support data flowing the other way:the form components deep in the hierarchy need to update the state in FilterableProductTable.
                                    ->The FilterableProductTable component maintains the state of the filter text and the checkbox, making it the single source of truth for these values.
                                    ->Inside the SearchBar, you will add the onChange event handlers and set the parent state from them:
*/



//Full code of Example Building a searchable product data table
import { useState } from 'react';

// Main component that manages the filter state and renders the SearchBar and ProductTable
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState(''); // State for the filter text
  const [inStockOnly, setInStockOnly] = useState(false); // State for the in-stock checkbox

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

// Component to render a category row in the product table
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

// Component to render a single product row in the product table
function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

// Component to render the table of products based on the filter and stock state
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// Component for the search input and in-stock checkbox
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

// Sample product data
const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

// Main app component that renders the FilterableProductTable with sample products
export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}


