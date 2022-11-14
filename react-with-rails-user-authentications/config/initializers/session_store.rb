if Rails.env === 'production'
    Rails.application.config.session_store :cookie_store, key: 'yourappname', domain: 'yourfrontdomain'
else
    Rails.application.config.session_store :cookie_store, key: '_test'
end