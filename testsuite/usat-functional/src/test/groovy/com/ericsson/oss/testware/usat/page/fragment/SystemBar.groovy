/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/

package com.ericsson.oss.testware.usat.page.fragment
import com.ericsson.oss.testware.usat.page.ability.WaitAbility

import org.openqa.selenium.By
import org.openqa.selenium.WebElement

class SystemBar implements PageFragment, WaitAbility {

    static final String LOGOUT_BUTTON = 'Log Out'

    @Override
    void waitForLoad() {
        waitVisible(cancelButton)
    }

    private String getButtonSelector(final String buttonText) {
        return "//*[text()='"+ buttonText + "']"
    }

    void clickSystemBarButton(final String buttonText) {
        final String buttonSelector = getButtonSelector(buttonText)
        WebElement systemBarButton = root.findElement(By.xpath(buttonSelector))
        waitVisible(systemBarButton)
        click(systemBarButton)
    }
}
