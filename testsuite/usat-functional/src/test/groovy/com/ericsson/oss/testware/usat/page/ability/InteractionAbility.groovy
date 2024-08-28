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

package com.ericsson.oss.testware.usat.page.ability

import org.openqa.selenium.WebElement

import static org.jboss.arquillian.graphene.Graphene.waitGui
import org.openqa.selenium.By

trait InteractionAbility {

    boolean falseOnException(Closure<Boolean> closure) {
        try {
            return closure()
        } catch (Exception ex) {
            return false
        }
    }

    String emptyStringOnException(Closure closure) {
        try {
           return closure()
        } catch (Exception e) {
           return ""
        }
    }
    
    WebElement waitVisible(WebElement element) {
        waitGui().until().element(element).is().visible()
        return element
    }

    WebElement waitNotVisible(WebElement element) {
        waitGui().until().element(element).is().not().visible()
        return element
    }

    WebElement waitPresent(WebElement element) {
        waitGui().until().element(element).is().present()
        return element
    }
    
    void waitCssPresent(String css) {
        waitGui().until().element(By.cssSelector(css)).is().present()
    }
    
    void waitCssNotPresent(String css) {
        waitGui().until().element(By.cssSelector(css)).is().not().present()
    }

    WebElement waitNotPresent(WebElement element) {
        waitGui().until().element(element).is().not().present()
        return element
    }

    WebElement waitClickable(WebElement element) {
        waitGui().until().element(element).is().clickable()
        return element
    }

    void click(WebElement element) {
        waitClickable(element).click()
        
    }
}
