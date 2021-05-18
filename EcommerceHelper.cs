using System;
using System.Security.Cryptography;
using System.Text;

namespace Generic.Ecom
{
    public static class EcommerceHelper
    {
        public static string GetHashedString(this string toHash)
        {
            using var md5 = MD5.Create();
            var hashed = md5.ComputeHash(ASCIIEncoding.UTF8.GetBytes(toHash));
            return BitConverter.ToString(hashed).Replace("-", "");
        }


    }
}
