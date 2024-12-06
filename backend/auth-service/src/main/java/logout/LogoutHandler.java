package logout;

import com.ibm.websphere.security.social.UserProfile;
import com.ibm.websphere.security.social.UserProfileManager;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

@RequestScoped
public class LogoutHandler {

    @Inject
    private GithubLogout githubLogout;

    @Inject
    private NativeLogout nativeLogout;
    
    private static final String GITHUB_LOGIN = "githubLogin";

    public ILogout getLogout() {
        UserProfile userProfile = UserProfileManager.getUserProfile();
        if (userProfile == null)
            return nativeLogout;
        String socialMedia = userProfile.getSocialMediaName();
        return switch(socialMedia) {
            case GITHUB_LOGIN -> githubLogout;
            default -> throw new UnsupportedOperationException("cannot find logout for " + socialMedia);
        };
    }

}
