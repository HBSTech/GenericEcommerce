using CMS.Ecommerce;
using CMS.Helpers;
using Kentico.Content.Web.Mvc;
using System.Threading.Tasks;

namespace Generic.Ecom.RepositoryLibrary
{
    public interface ISKURepository
    {
        Task<string> GetProductAlias(int skuid, ContainerCustomData containerCustomData);
    }
}