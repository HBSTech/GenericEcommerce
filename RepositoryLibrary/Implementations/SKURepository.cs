using CMS.Ecommerce;
using CMS.DocumentEngine;
using System;
using System.Collections.Generic;
using System.Text;
using Kentico.Content.Web.Mvc;
using CMS.DataEngine;
using System.Threading.Tasks;
using System.Linq;
using CMS.Helpers;

namespace Generic.Ecom.RepositoryLibrary
{
    public class SKURepository : ISKURepository
    {
        public IPageRetriever PageRetriever { get; }
        public ISKUInfoProvider SKUInfoProvider { get; }
        public IEcommerceServiceOptions EcommerceServiceOptions { get; }
        public IProgressiveCache ProgressiveCache { get; }

        public SKURepository(IPageRetriever pageRetriever, ISKUInfoProvider sKUInfoProvider, IEcommerceServiceOptions ecommerceServiceOptions, IProgressiveCache progressiveCache)
        {
            PageRetriever = pageRetriever;
            SKUInfoProvider = sKUInfoProvider;
            EcommerceServiceOptions = ecommerceServiceOptions;
            ProgressiveCache = progressiveCache;
        }

        public async Task<string> GetProductAlias(int skuid, ContainerCustomData containerCustomData)
        {
            var result = await ProgressiveCache.LoadAsync(async (cs) =>
            {
                var treeNode = await PageRetriever.RetrieveAsync<TreeNode>(x =>
                x.Where(nameof(TreeNode.NodeSKUID), QueryOperator.Equals, skuid));
                return treeNode.FirstOrDefault()?.NodeAliasPath;
            }, new CacheSettings(EcommerceServiceOptions.CacheMinutes(), "GetSKUAlias", EcommerceHelper.GetHashedString($"{skuid}|{containerCustomData}")));
            return result;
        }
    }
}
