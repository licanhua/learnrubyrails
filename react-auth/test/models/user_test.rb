require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "user has mandatory field" do
    user = User.new
    assert_not user.save
  end
end
