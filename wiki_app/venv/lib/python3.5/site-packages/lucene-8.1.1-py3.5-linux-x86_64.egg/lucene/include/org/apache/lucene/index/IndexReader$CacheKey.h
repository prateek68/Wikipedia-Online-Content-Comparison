#ifndef org_apache_lucene_index_IndexReader$CacheKey_H
#define org_apache_lucene_index_IndexReader$CacheKey_H

#include "java/lang/Object.h"

namespace java {
  namespace lang {
    class Class;
  }
}
template<class T> class JArray;

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {

        class IndexReader$CacheKey : public ::java::lang::Object {
         public:

          static ::java::lang::Class *class$;
          static jmethodID *mids$;
          static bool live$;
          static jclass initializeClass(bool);

          explicit IndexReader$CacheKey(jobject obj) : ::java::lang::Object(obj) {
            if (obj != NULL && mids$ == NULL)
              env->getClass(initializeClass);
          }
          IndexReader$CacheKey(const IndexReader$CacheKey& obj) : ::java::lang::Object(obj) {}
        };
      }
    }
  }
}

#include <Python.h>

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {
        extern PyType_Def PY_TYPE_DEF(IndexReader$CacheKey);
        extern PyTypeObject *PY_TYPE(IndexReader$CacheKey);

        class t_IndexReader$CacheKey {
        public:
          PyObject_HEAD
          IndexReader$CacheKey object;
          static PyObject *wrap_Object(const IndexReader$CacheKey&);
          static PyObject *wrap_jobject(const jobject&);
          static void install(PyObject *module);
          static void initialize(PyObject *module);
        };
      }
    }
  }
}

#endif
