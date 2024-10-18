package logout;

import com.ibm.websphere.security.social.UserProfileManager;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

@RequestScoped
public class LogoutHandler {

    @Inject
    private GithubLogout githubLogout;
    
    private static final String GITHUB_LOGIN = "githubLogin";

    public ILogout getLogout() {
        String socialMedia = UserProfileManager.getUserProfile().getSocialMediaName();
        return switch(socialMedia) {
            case GITHUB_LOGIN -> githubLogout;
            default -> throw new UnsupportedOperationException("cannot find logout for " + socialMedia);
        };
    }

}
