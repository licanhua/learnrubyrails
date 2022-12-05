# Part 1 etting-up-devise-with-rails-7
## Setting Up Devise With Rails 7 And React

This covers Setting up a basic sign up and login flow with Devise. Credit to [dennisokeeffe's Setting Up Devise With Rails 7](https://blog.dennisokeeffe.com/blog/2022-03-07-part-1-setting-up-devise-with-rails-7)


### Initialize the project demo-rails-7-with-devise-series:
```sh
# Create a new rails project
$ rails new demo-rails-with-react-frontend
$ cd demo-rails-with-react-frontend

# Add required gem
$ bundler add devise

# Scaffold the app
$ bin/rails generate devise:install
$ bin/rails generate devise User

# Generate a home controller for us to test against
$ bin/rails generate controller home index
```


### Ensure you have defined default url options in your environments files.
 Here is an example of default_url_options appropriate for a development environment in config/environments/development.rb:

```rb
       config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```

### Requiring authentication for our controller

We are going to update the application controller at app/controllers/application_controller.rb to always require a user to be logged in for all actions:

```rb
class ApplicationController < ActionController::Base
  before_action :authenticate_user!
end
```

### Setup routing

```rb
Rails.application.routes.draw do
  root 'home#index'
  devise_for :users
end
```

### Setup the Devise initializer

In my current version of Rails 7, I also needed to update the config/initializers/devise.rb file to uncomment the config.navigational_formats and add the :turbo_stream for the default Devise handler after signing up:
```rb
config.navigational_formats = ['*/*', :html, :turbo_stream]
```

### Updating our view

Let's set the values of app/views/home/index.html.erb to the following:

```rb
<h1>Home#index</h1>
<p>Find me in app/views/home/index.html.erb</p>
<%= link_to "Log out", destroy_user_session_path, data: { "turbo-method":
:delete } %>
```

### Starting the server

```sh
# Create and migrate the db
$ bin/rails db:create db:migrate

# Start the server (including the React app)
$ bin/rails s
```

## Trouble shootings

### undefined method `user_url' for

```
NoMethodError in Devise::RegistrationsController#create
undefined method `user_url' for #<Devise::RegistrationsController:0x0000000000c508>

Exception Causes
ActionView::MissingTemplate: Missing template devise/registrations/create, devise/create, application/create with {:locale=>[:en], :formats=>[:html], :variants=>[], :handlers=>[:raw, :erb, :html, :builder, :ruby, :jbuilder]}. Searched in: * "C:/repo/learnrubyrails/demo-rails-with-react-frontend/app/views" * "C:/Ruby30-x64/lib/ruby/gems/3.0.0/gems/devise-4.8.1/app/views" * "C:/Ruby30-x64/lib/ruby/gems/3.0.0/gems/actiontext-7.0.4/app/views" * "C:/Ruby30-x64/lib/ruby/gems/3.0.0/gems/actionmailbox-7.0.4/app/views" Did you mean? devise/registrations/edit devise/registrations/new devise/mailer/confirmation_instructions devise/mailer/reset_password_instructions devise/passwords/edit devise/mailer/email_changed

```

solution
```rb
  config.navigational_formats = ['*/*', :html, :turbo_stream]
```

# Part 2 using-redis-sessions-instead-of-cookie-store

## Setup redis

I'm using docker on windows. So I follows

https://hub.docker.com/_/redis/

```cmd
# pull redis image
docker pull redis

# start redis on port 6379
docker run  -p 6379:6379 redis

```

To see what is happening with the Redis store, you can run redis-cli monitor in docker CLI to see what is happening

```
# redis-cli
127.0.0.1:6379> monitor
OK
1670219144.328097 [0 172.17.0.1:40216] "get" "session:2::8c48803249eb66e674889476fb8349ada96852d324f33a0e7ba29afeb6fdd8c2"
1670219144.367693 [0 172.17.0.1:40216] "setex" "session:2::8c48803249eb66e674889476fb8349ada96852d324f33a0e7ba29afeb6fdd8c2" "5400" "\x04\b{\bI\"\nflash\x06:\x06ET{\aI\"\x0cdiscard\x06;\x00T[\x00I\"\x0cflashes\x06;\x00T{\x06I\"\x0bnotice\x06;\x00FI\"\x1cSigned in successfully.\x06;\x00TI\"\x19warden.user.user.key\x06;\x00T[\a[\x06i\x06I\"\"$2a$12$.0ZPXRjKSAQJmAeCSarRAO\x06;\x00TI\"\x10_csrf_token\x06;\x00FI\"0GWf5_nL6CP6jvIc5bqoute4d0UU1F5Q8c26WbnLfys8\x06;\x00F"
```

## Add required gems

```
bundler add redis-rails
```

## Create  config/initializers/session_store.rb
```rb
Rails.application.config.session_store :redis_store,
                                       servers: ['redis://localhost:6379/0/session'],
                                       expire_after: 90.minutes,
                                       key: '_demo_devise_omniauth_react_session'
```
