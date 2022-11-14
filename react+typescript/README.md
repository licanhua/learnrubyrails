# Create a Rails 7.0.4 API with React Frontend using Hooks and TypeScript

This is a variant based on [Karim Marabet's project](https://blog.devgenius.io/create-a-rails-api-with-react-frontend-using-hooks-and-typescript-dcb4e84c3dbf)

There are multiple ways to create a Rails + React + Typescript project.
In this tutorial, we build a Rails API-only application as a backend and React application as a frontend.


# Create backend project
## Creating Rails API
```
rails new back-app --api -T
```

Flag `--api` inherits ApplicationController from ActionController::API instead of ActionController::Base that provides Action Controller modules used by browser apps and skip generating views, helpers, and assets that are not needed for our purpose.

The command `-T` is to skip the generation of Minitest::Unit files and folders.

## Setup CORS
CORS is an HTTP-header-based security mechanism that defines who’s allowed to interact with your API. In this article, for simplicity, it allows all origins.(Don't use it in product, there is a good guide for it https://www.stackhawk.com/blog/rails-cors-guide/)

1. Add rack-cors to Gemfile.

```ruby
gem 'rack-cors'
```

2. And bundle it.

```
bundle install
```

3. Update config/initializers/cors.rb to allow all origins (*) to make requests.

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## Generate post’s scaffolding
For more visibility let’s generate a scaffold, migrate the database, and start the server.

```
rails g scaffold Post title:string content:text
rails db:create db:migrate
```

## Changing REST API Versioning
Use REST API Versioning. Versioning helps us to iterate faster when the needed changes are identified in the APIs.

1. Move `posts_controller.rb` to `app/controllers/api/v1/posts_controller`.rb .
2. Change `class PostsController < ApplicationController` to `class Api::V1::PostsController < ApplicationController`.
3. Change post location in create action from this
`render json: @post, status: :created, location: @post`
to this
`render json: @post, status: :created, location: api_v1_post_path(@post)`

## Update the routes
1. change router.rb
```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts
    end
  end
  # ...
end
```

2. To show the routes enter the command 
```
rails routes --expanded .
```

## Database seeding
1. To generate fake data for posts I will use the faker gem.

```ruby
gem 'faker'
```

2. Bundle it.

```
bundle
```

3. Insert some faker data to seeds.rb .

```
require 'faker'
10.times do
  Post.create(
    title: Faker::Lorem.sentence,
    content: Faker::Lorem.paragraph)
end
```

4. Run the command.
```
rails db:seed
```

## And start the server

```
rails s
```

# Create front end

## Create React App with the TypeScript template. You may create a React application in the root of the Rails application or in any other place.

```
npx create-react-app front-app --template typescript
cd front-app
npm install
```

## Create a .env file in the root of the project and enter the server port there.
```
PORT=4000
```

## Installing React Bootstrap
Run the installation.

```
npm i react-bootstrap bootstrap@5.1.3
```

## And add import the library in index.tsx .

```
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Configure Routing
Routing allows you to navigate to other pages.

1. Pages
First, create a Homapage component with .tsx extension in src/Pages/HomePage.tsx.

```tsx
export const HomePage = () => {
  return (
    <>
      <h1>Hello World!</h1>
    </>
  )
}
```

2. Create some additional pages src/Pages/NotFoundPage.tsx .
```tsx
export const NotFoundPage = () => (
  <>
    <h1>Not Found 404</h1>
  </>
)
```

3. And src/Pages/AboutPage.tsx .
```tsx
export const AboutPage = () => (
  <>
    <h1>About me</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
  </>
)
```

4. React Router
Now install a React Router library.
```
npm i react-router-dom
```

## Update index.tsx .

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
```

## update App.tsx .

```tsx
import { Routes, Route, Link } from 'react-router-dom'
import { HomePage } from './Pages/HomePage';
import { AboutPage } from './Pages/AboutPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { Container, Navbar } from 'react-bootstrap';
function App() {
  return (
    <>
      <Container>
        <Navbar expand="lg" variant="light" bg="light">
          <Container>
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/about">About Me</Link>
          </Container>
        </Navbar><br />
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}
export default App;
```

## Creating Components
TypeScript helps implement better type checking using Interfaces.

An Interface is a structure that acts as a contract in our application. It defines the syntax for classes to follow, which means a class that implements an interface is bound to implement all its members.

1. Post interface
So, firstly we need to create a Post interface in src/Components/Post.tsx .

```tsx
export interface IPost {
  id?: number;
  title: string;
  content: string;
}
```

2. Post component
Create Post component in src/Components/Post.tsx .

```tsx
import { IPost } from '../types/data';
export const Post = (props: IPost) => (
  <>
    <h2>{props.title}</h2>
    <p>{props.content}</p>
  </>
)
```

3. PostList component
To output the posts from the server I will use the PostList component that will call the Post component in each iteration.

To make requests to the server I use the Axios library. Let’s install it.

```
npm i axios
```

Create PostList component in src/Components/PostList.tsx(see soure code).


Here I apply useState for tracking the state of posts that satisfy the IPost interface, and useEffect for getting posts from the server using the async arrow function getPosts.

Function updatePostList is used for updating the post list including a new post.

4. PostForm is a component that I will create below.

In the end, I iterate through posts and call children Post component with props.

Updating Homepage
Change Homepage.tsx to output posts.

```tsx
import {PostList} from '../Components/PostList'
export const HomePage = () => (
  <>
    <PostList />
  </>
)
```

PostForm component
For easy validations, I will use React Hook Form.

First, install it.

```
npm i react-hook-form
```

Create src/posts/PostForm.tsx (see soure code)



# Testing
Let’s start the server.
```
npm start
```
