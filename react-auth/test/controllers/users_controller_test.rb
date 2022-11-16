require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  test "should show profile" do
    # helper is now reusable from any controller test case
    sign_in_as users(:one)

    #get profile_url
    assert_response :success
  end
end
