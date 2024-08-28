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
import org.openqa.selenium.NoSuchElementException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class ActionBar implements PageFragment, WaitAbility {
    
    static final String CREATE_DECISION_RULE_BUTTON = 'Create'
    static final String DELETE_DECISION_RULE_BUTTON = 'Delete'
    static final String EDIT_DECISION_RULE_BUTTON = 'Edit'
    static final String ACTIVATE_DECISION_RULE_BUTTON = 'Activate'
    static final String DEACTIVATE_DECISION_RULE_BUTTON = 'Deactivate'

    @FindBy(css = ".elLayouts-ActionBarButton")
    WebElement cancelButton

    @FindBy(xpath = "//button[@class= 'ebBtn  elLayouts-ActionBarButton' and text() = 'Add a Widget']")
    WebElement addWidgetButton

    @FindBy(xpath = "//span[text()='Deactivate']")
    WebElement deactivateButton

    @Override
    void waitForLoad() {
        waitVisible(cancelButton)
    }

    private String getButtonSelector(final String buttonText) {
        return "//*[text()='"+ buttonText + "']"
    }

    boolean isButtonDisplayed(final String buttonText) {
        final String buttonSelector = getButtonSelector(buttonText)
        try {
            WebElement actionBarButton = root.findElement(By.xpath(buttonSelector))
            return actionBarButton.isDisplayed()
        } catch (NoSuchElementException e) {
            return false
        }
    }

    void clickActionBarButton(final String buttonText) {
        final String buttonSelector = getButtonSelector(buttonText)
        WebElement actionBarButton = root.findElement(By.xpath(buttonSelector))
        waitVisible(actionBarButton)
        click(actionBarButton)
    }

    void clickDeactivateButton() {
        waitVisible(deactivateButton)
        click(deactivateButton)
    }
}
