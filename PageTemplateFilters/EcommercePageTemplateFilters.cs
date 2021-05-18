using Kentico.PageBuilder.Web.Mvc.PageTemplates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Generic.Ecom
{
    public class EcommercePageTemplateFilters : IPageTemplateFilter
    {
        public IEnumerable<PageTemplateDefinition> Filter(IEnumerable<PageTemplateDefinition> pageTemplates, PageTemplateFilterContext context)
        {
            // Applies filtering to a collection of page templates based on the page type of the currently edited page
            if (context.PageType.Equals("Generic.Ecommerce", StringComparison.InvariantCultureIgnoreCase))
            {
                // Filters the collection to only contain filters allowed for ecommerce pages
                return pageTemplates.Where(t => GetEcommerceTemplates().Contains(t.Identifier));
            }

            // Excludes all landing page templates from the collection if the context does not match this filter
            // Assumes that the categories of page templates are mutually exclusive
            return pageTemplates.Where(t => !GetEcommerceTemplates().Contains(t.Identifier));
        }

        // Gets all page templates that are allowed for landing pages
        public IEnumerable<string> GetEcommerceTemplates() => new string[] { "Generic.Ecom.Checkout", "Generic.Ecom.ShoppingCart" };
    }
}
