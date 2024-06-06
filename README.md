# Predictor

LIVE BETA AT https://predictor-react.vercel.app/

This mobile webapp aims to serve as a non-monetary [prediction market](https://en.wikipedia.org/wiki/Prediction_market) for the administrator, while presenting a simple and fun gamified betting interface to users. In small scale applications, such as a local group of friends, it serves primarily a purpose of entertainment, though when scaled up to regional or greater levels, the data collected can provide valuable insight into trends in public sentiment around key issues, eg. politics, cultural issues, market trends, and more.

It's designed to work with the [Predictor API](https://github.com/allendemoura/predictor-backend-API) backend.

## Prediction Markets

The inspiration for this project came after a conversation about the 2016 US presidential election with an attorney friend. He was keen to point out that, while the results shocked the world round, in retrospect there was some compelling data in an unlikely place: UK sports bookies. Political betting is illegal in the US, but fair game in other nations such and the United Kingdom, where political betting is commonplace and offered in 'bodega'-style corner stores all througout the country. An [examination](https://money.com/donald-trump-2016-election-win-gambling-bets/) of the bets made revealed that, while the odds heavily favored a Clinton win due to the monetary value of the bets placed on her side, the bets on Trump were actually much more numerous, just made in much smaller amounts. One bookmaker, William Hill, reported in the article linked above that 75% of the money staked with them was on Clinton, but 69% of individual bets were on Trump. A nearly identical outcome is observed [here](https://theweek.com/brexit/73916/bookies-on-brexit-this-vote-worked-out-very-well-for-us) with the Brexit referendum. While bookies are keen to note in the latter article that their oddsmakers are not in the business of predictive accuracy, there is only one factor in the way of that - profit motive. Absent of the overt profit motive of traditional gambling operators, I believe that these mechanics may be able to serve a much greater purpose, and potentially offer opportunites to interact with these abstract shifts in popular sentiment before they turn into shocking upsets like those seen in 2016 and beyond.

While statistical analysis of such data is beyond the scope of this small project, I found the relation between these bets and electoral politics compelling enough to create this project as a vector to accumulate and experiment with this data. It's easy to see where the utility of this could into other areas where public opinion or "temperature" is a high impact factor, and some [projects](https://www.nytimes.com/2023/10/08/technology/prediction-markets-manifold-manifest.html) have come to my attention that are already exploring these ideas.

Future projects might include translation of the data into weighted vector databases, and machine learning analysis.

# Project Description

This is the first webapp that I've developed full stack (front and back end). I chose a React front end for its ubiquity, and took the opportunity to learn it for this project. The back end is an Express API in Node, and can be found [here](https://github.com/allendemoura/Gambol).

I found the React component system fairly intuitive, and loved the idea of JSX interweaving my JS and HTML, but my first challenges came in some of the proclivities of JSX such as the need for <>fragments</>, and the some of the syntactic gymnastics required for ternary expressions. I often found myself in the uncanny valley between refactoring my code into new components, or writing inreasingly ugly and complex nested ternary rendering statements. In many cases, it was not clear which would result in less code duplication, prop drilling, etc, or what the best practice might be. After lots of googling and talks with colleagues, I got mostly contradictory personal preferences, so I chalked it up to the fluid and sometimes chaotic nature of web development standards, experimented with both sides of this coin, and tried to find a balance.

Another challenge was the UI design and general UX. I chose to focus on the mobile viewport for this app, because it seemed to me to be the most likely way that people would be interacting with an app like this. The design of it is centered on spontaneous and fun engagment, rather than the more contemplative sit-down desk format of something like a stock trading platform. I wanted to provide a simple dashboard for users that presented useful and engaging info, in a mobile-focused form factor.

More info on the UX can be found below in the component descriptions.

## Prerequisites

Before running this React frontend, make sure you have the following prerequisites set up:

- Node.js and npm installed on your development machine.
- An API server URL where the backend is hosted.
- A Clerk Publishable Key for authentication.

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone <repository-url>
   cd prediction-market-frontend
   ```

2. Install the project dependencies using npm:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and define the following environment variables:

   ```
   REACT_APP_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   REACT_APP_API_SERVER_URL=your-api-server-url
   ```

   Replace `your-clerk-publishable-key` with your Clerk Publishable Key and `your-api-server-url` with the URL of the API backend.

## Usage

To start the React application locally, run the following command:

```bash
npm start
```

This will start the development server, and you can access the application in your web browser at `http://localhost:3000`.

## Folder Structure

The project's folder structure is organized as follows:

- `src/`: Contains the source code of the React application.
- `components/`: Contains React components used in the application.
- `routes/`: Contains page components and loaders for different routes.

## Features

- **Dashboard**: View the main dashboard of the prediction market.
- **Sign-In/Sign-Up**: User authentication with Clerk.
- **Pool**: View and interact with prediction pools.
- **Leaderboard**: See the leaderboard of top users.

## Dashboard Component

The `Dashboard` component is a key part of the Prediction Market Betting web application. It provides an interface for users to explore active and closed betting pools. Here's an overview of the component's functionality and key features:

- **Active Betting Pools**: Display a list of active betting pools where users can place bets. Each pool includes information such as the current point, description, and a visual representation of the bets using a color gradient background.

- **Closed Betting Pools**: Show closed betting pools, displaying the final results, including whether the user's bets were winners or losers. Similar to active pools, closed pools provide information about the pool's point, description, and a visual representation of the bets using a color gradient background.

- **User Interaction**: The component interacts with the API to retrieve data on users, pools, and bets. Users can view details about the pools, see if they have placed bets in them, and check the results.

The code for the `Dashboard` component can be found in the project's source code. It uses various components from popular libraries such as React Router and Clerk for user authentication. The component's primary purpose is to render a user-friendly and interactive dashboard for users of the application.

For more detailed insights into the component's implementation, you can refer to the source code in the project's `src/` directory.

## Header Component

The `Header` component serves as the top navigation bar for the Gambol! web application. It offers a clear and accessible interface for users to navigate through the app and interact with their accounts. Key features include:

- **Title and Home Link**: The application title is prominently displayed, and users can click it to return to the homepage.

- **Leaderboard Icon Link**: Users can access the leaderboard by clicking on the trophy icon, allowing them to view the rankings and performance of participants.

- **User/Sign-In Corner**: Depending on the user's authentication state, this corner displays either a "Sign In" link or the `UserButton` component. This feature enables users to log in and access their accounts seamlessly.

The `Header` component contributes to the overall user experience of the application by providing a consistent and user-friendly navigation interface.

For a more detailed understanding of the component's implementation, please refer to the source code located in the project's `src/` directory.

## Pool Component

The `Pool` component is responsible for presenting the details of an individual betting pool. It offers a user-friendly interface for viewing and participating in the selected pool. Here's an overview of the component's functionality and key features:

- **User Balance Banner**: This section displays the user's balance, which can be accessed if the user is logged in. It provides a quick link to navigate back to all available pools.

- **Over Display Component**: The component displays the betting options related to the "Over" category. Users can place their bets and view the current status of this category, including the total amount wagered by all users.

- **Center Point Display**: This part showcases the key information about the pool, including the current point and a description. The description is visually limited to maintain the presentation's aesthetics.

- **Under Display Component**: Similar to the "Over" display, this part focuses on the "Under" category. Users can place their bets and check the status of this category, including the total bet amount.

The code for the `Pool` component can be found in the project's source code. It uses components from React and integrates with Clerk for user authentication. The component serves as a critical element in the Prediction Market Betting web application, enabling users to engage with and place bets in specific pools.

For more detailed insights into the component's implementation, you can refer to the source code in the project's `src/` directory.

## PoolBets Component

The `PoolBets` component is a crucial element of the Prediction Market Betting web application that allows users to view and place bets in betting pools. This component is responsible for rendering the user interface of individual betting pools, enabling users to make wagers on their predicted outcomes.

Key features of the `PoolBets` component include:

- **Bet Display**: Users can view the total amount wagered on each pool side (over or under), helping them gauge market sentiment.

- **Bet Form**: Users can open a betting form to place their bets. They can choose the amount they want to wager and click the "Bet" button to submit their prediction.

- **Color Coded Right Side Bet Indicator Bar**: Bets are color-coded based on the user to provide a visual indication of their wagers. The user's bets are highlighted in orange.Users can drag their finger over bet bar sections to see detailed information about each bet, including the user's name and the bet amount.

- **Winnings Estimation**: The component calculates and displays a minimum winnings estimation based on the user's bet amount and the pool's total amount.

The `PoolBets` component dynamically updates and reacts to user interactions, such as bet placement and hover actions, providing an engaging and user-friendly experience.

For a more comprehensive understanding of the component's implementation, please refer to the source code located in the project's `src/` directory.

## Leaderboard Component

The `Leaderboard` component provides users with a view of the top users ranked by their balance within the Prediction Market Betting web application. It also offers insights into the user's own performance in comparison to other bettors.

## Contributing

If you would like to contribute to this project, pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
